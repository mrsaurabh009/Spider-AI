import Anthropic from '@anthropic-ai/sdk';
import { config } from '@/config';
import { logger } from '@/utils/logger';
import { CodeGenerationRequest, GeneratedCode, ProjectFramework } from '@/types/ai';
import { generateSystemPrompt, generateUserPrompt } from '@/utils/prompts';
import { validateGeneratedCode, formatGeneratedCode } from '@/utils/codeValidation';

export class AIService {
  private anthropic: Anthropic;
  private model: string;
  private maxTokens: number;
  private temperature: number;

  constructor() {
    this.anthropic = new Anthropic({
      apiKey: config.ai.claude.apiKey,
    });
    this.model = config.ai.claude.model;
    this.maxTokens = config.ai.claude.maxTokens;
    this.temperature = config.ai.claude.temperature;
  }

  /**
   * Generate complete full-stack application from natural language description
   */
  async generateApplication(request: CodeGenerationRequest): Promise<GeneratedCode> {
    try {
      logger.info('Starting application generation', {
        framework: request.framework,
        type: request.type,
        promptLength: request.prompt.length
      });

      // Generate system prompt based on framework and type
      const systemPrompt = generateSystemPrompt(request.framework, request.type);
      
      // Generate user prompt with context
      const userPrompt = generateUserPrompt(request);

      // Call Claude API
      const response = await this.anthropic.messages.create({
        model: this.model,
        max_tokens: this.maxTokens,
        temperature: this.temperature,
        system: systemPrompt,
        messages: [
          {
            role: 'user',
            content: userPrompt
          }
        ]
      });

      // Extract and parse generated code
      const rawContent = response.content[0]?.type === 'text' ? response.content[0].text : '';
      const generatedCode = await this.parseGeneratedCode(rawContent, request.framework);

      // Validate generated code
      const validation = await validateGeneratedCode(generatedCode);
      if (!validation.isValid) {
        logger.warn('Generated code validation failed', validation.errors);
        // Attempt to fix common issues
        generatedCode.frontend = await formatGeneratedCode(generatedCode.frontend, 'frontend');
        if (generatedCode.backend) {
          generatedCode.backend = await formatGeneratedCode(generatedCode.backend, 'backend');
        }
      }

      // Calculate usage
      const usage = {
        promptTokens: response.usage.input_tokens,
        completionTokens: response.usage.output_tokens,
        totalTokens: response.usage.input_tokens + response.usage.output_tokens
      };

      logger.info('Application generation completed', {
        tokensUsed: usage.totalTokens,
        hasBackend: !!generatedCode.backend,
        hasDatabase: !!generatedCode.database
      });

      return {
        ...generatedCode,
        usage,
        model: this.model,
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      logger.error('Application generation failed', error);
      throw new Error(`AI generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Refine existing code based on user feedback
   */
  async refineCode(
    existingCode: GeneratedCode, 
    refinementRequest: string, 
    context?: string
  ): Promise<GeneratedCode> {
    try {
      logger.info('Starting code refinement', {
        requestLength: refinementRequest.length,
        hasContext: !!context
      });

      const systemPrompt = `You are a senior full-stack developer tasked with refining existing code based on user feedback.

INSTRUCTIONS:
1. Analyze the existing code carefully
2. Understand the user's refinement request
3. Make precise, surgical changes to improve the code
4. Maintain existing functionality unless explicitly asked to change it
5. Follow the same structure and patterns as the original code
6. Ensure all changes are compatible with the existing codebase

RESPONSE FORMAT:
Return the complete refined code in the same JSON structure as provided.

EXISTING CODE:
\`\`\`json
${JSON.stringify(existingCode, null, 2)}
\`\`\`

${context ? `ADDITIONAL CONTEXT:\n${context}\n` : ''}`;

      const userPrompt = `Please refine the existing code based on this request:

${refinementRequest}

Return the complete updated code maintaining the same structure and format.`;

      const response = await this.anthropic.messages.create({
        model: this.model,
        max_tokens: this.maxTokens,
        temperature: this.temperature,
        system: systemPrompt,
        messages: [
          {
            role: 'user',
            content: userPrompt
          }
        ]
      });

      const rawContent = response.content[0]?.type === 'text' ? response.content[0].text : '';
      const refinedCode = await this.parseGeneratedCode(rawContent, existingCode.framework);

      // Calculate usage
      const usage = {
        promptTokens: response.usage.input_tokens,
        completionTokens: response.usage.output_tokens,
        totalTokens: response.usage.input_tokens + response.usage.output_tokens
      };

      logger.info('Code refinement completed', {
        tokensUsed: usage.totalTokens
      });

      return {
        ...refinedCode,
        usage,
        model: this.model,
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      logger.error('Code refinement failed', error);
      throw new Error(`Code refinement failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Generate specific component or feature
   */
  async generateComponent(
    componentRequest: string,
    framework: ProjectFramework,
    context?: string
  ): Promise<{ code: string; usage: any }> {
    try {
      logger.info('Starting component generation', {
        framework,
        requestLength: componentRequest.length
      });

      const systemPrompt = generateSystemPrompt(framework, 'component');
      const userPrompt = `Generate a ${framework} component based on this request:

${componentRequest}

${context ? `Context: ${context}` : ''}

Provide clean, production-ready code with proper TypeScript types, styling, and best practices.`;

      const response = await this.anthropic.messages.create({
        model: this.model,
        max_tokens: this.maxTokens * 0.5, // Smaller limit for components
        temperature: this.temperature,
        system: systemPrompt,
        messages: [
          {
            role: 'user',
            content: userPrompt
          }
        ]
      });

      const code = response.content[0]?.type === 'text' ? response.content[0].text : '';
      
      const usage = {
        promptTokens: response.usage.input_tokens,
        completionTokens: response.usage.output_tokens,
        totalTokens: response.usage.input_tokens + response.usage.output_tokens
      };

      logger.info('Component generation completed', {
        tokensUsed: usage.totalTokens
      });

      return { code, usage };

    } catch (error) {
      logger.error('Component generation failed', error);
      throw new Error(`Component generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Explain code functionality
   */
  async explainCode(code: string): Promise<{ explanation: string; usage: any }> {
    try {
      logger.info('Starting code explanation', {
        codeLength: code.length
      });

      const systemPrompt = `You are a senior developer who excels at explaining code in a clear, educational manner.

INSTRUCTIONS:
1. Analyze the provided code thoroughly
2. Explain what the code does in simple terms
3. Highlight key features and functionality
4. Explain the architecture and patterns used
5. Mention any best practices or notable aspects
6. Use clear, non-technical language when possible`;

      const userPrompt = `Please explain this code:

\`\`\`
${code}
\`\`\`

Provide a comprehensive but accessible explanation of what this code does and how it works.`;

      const response = await this.anthropic.messages.create({
        model: this.model,
        max_tokens: 2048,
        temperature: 0.3, // Lower temperature for more factual explanations
        system: systemPrompt,
        messages: [
          {
            role: 'user',
            content: userPrompt
          }
        ]
      });

      const explanation = response.content[0]?.type === 'text' ? response.content[0].text : '';
      
      const usage = {
        promptTokens: response.usage.input_tokens,
        completionTokens: response.usage.output_tokens,
        totalTokens: response.usage.input_tokens + response.usage.output_tokens
      };

      logger.info('Code explanation completed', {
        tokensUsed: usage.totalTokens
      });

      return { explanation, usage };

    } catch (error) {
      logger.error('Code explanation failed', error);
      throw new Error(`Code explanation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Parse generated code from AI response
   */
  private async parseGeneratedCode(content: string, framework: ProjectFramework): Promise<Omit<GeneratedCode, 'usage' | 'model' | 'timestamp'>> {
    try {
      // Try to extract JSON from the response
      const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[1]);
        return this.validateParsedCode(parsed, framework);
      }

      // Try to extract code blocks
      const frontendMatch = content.match(/```(?:tsx?|jsx?)\n([\s\S]*?)\n```/);
      const backendMatch = content.match(/```(?:ts|js|typescript|javascript)\n([\s\S]*?)\n```/g)?.[1];
      const databaseMatch = content.match(/```(?:sql|prisma)\n([\s\S]*?)\n```/);
      const packageMatch = content.match(/```json\n([\s\S]*?package\.json[\s\S]*?)\n```/);

      return {
        framework,
        frontend: frontendMatch ? frontendMatch[1] : this.generateFallbackFrontend(framework),
        backend: backendMatch ? backendMatch.match(/```(?:ts|js|typescript|javascript)\n([\s\S]*?)\n```/)?.[1] : undefined,
        database: databaseMatch ? databaseMatch[1] : undefined,
        packageJson: packageMatch ? JSON.parse(packageMatch[1]) : this.generateDefaultPackageJson(framework),
        files: this.extractFileStructure(content)
      };

    } catch (error) {
      logger.error('Failed to parse generated code', error);
      return this.generateFallbackCode(framework);
    }
  }

  /**
   * Validate parsed code structure
   */
  private validateParsedCode(parsed: any, framework: ProjectFramework): any {
    return {
      framework,
      frontend: parsed.frontend || this.generateFallbackFrontend(framework),
      backend: parsed.backend,
      database: parsed.database,
      packageJson: parsed.packageJson || this.generateDefaultPackageJson(framework),
      files: parsed.files || []
    };
  }

  /**
   * Generate fallback frontend code
   */
  private generateFallbackFrontend(framework: ProjectFramework): string {
    const templates = {
      REACT: `import React from 'react';

function App() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Welcome to Your App
          </h1>
          <p className="text-gray-600">
            Your application has been generated successfully. 
            Start customizing it to match your requirements.
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;`,
      VUE: `<template>
  <div id="app" class="min-h-screen bg-gray-50 flex items-center justify-center">
    <div class="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden">
      <div class="p-6">
        <h1 class="text-2xl font-bold text-gray-800 mb-4">
          Welcome to Your Vue App
        </h1>
        <p class="text-gray-600">
          Your application has been generated successfully.
        </p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      message: 'Welcome to Spider AI'
    };
  }
};
</script>`,
      NEXTJS: `import React from 'react';
import Head from 'next/head';

export default function Home() {
  return (
    <div>
      <Head>
        <title>Spider AI App</title>
      </Head>
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto bg-white rounded-xl shadow-md p-6">
          <h1 className="text-2xl font-bold mb-4">Welcome to Your Next.js App</h1>
          <p className="text-gray-600">Generated by Spider AI</p>
        </div>
      </main>
    </div>
  );
}`,
    };

    return templates[framework] || templates.REACT;
  }

  /**
   * Generate default package.json
   */
  private generateDefaultPackageJson(framework: ProjectFramework): any {
    const basePackage = {
      name: 'spider-ai-generated-app',
      version: '1.0.0',
      private: true,
    };

    const frameworkConfigs = {
      REACT: {
        ...basePackage,
        dependencies: {
          'react': '^18.2.0',
          'react-dom': '^18.2.0',
          'react-scripts': '^5.0.1'
        },
        scripts: {
          start: 'react-scripts start',
          build: 'react-scripts build',
          test: 'react-scripts test',
        }
      },
      VUE: {
        ...basePackage,
        dependencies: {
          'vue': '^3.3.0'
        },
        devDependencies: {
          '@vitejs/plugin-vue': '^4.2.0',
          'vite': '^4.3.0'
        }
      },
      NEXTJS: {
        ...basePackage,
        dependencies: {
          'next': '^13.4.0',
          'react': '^18.2.0',
          'react-dom': '^18.2.0'
        },
        scripts: {
          dev: 'next dev',
          build: 'next build',
          start: 'next start'
        }
      }
    };

    return frameworkConfigs[framework] || frameworkConfigs.REACT;
  }

  /**
   * Generate fallback code when parsing fails
   */
  private generateFallbackCode(framework: ProjectFramework): any {
    return {
      framework,
      frontend: this.generateFallbackFrontend(framework),
      packageJson: this.generateDefaultPackageJson(framework),
      files: []
    };
  }

  /**
   * Extract file structure from AI response
   */
  private extractFileStructure(content: string): Array<{ path: string; content: string }> {
    const files: Array<{ path: string; content: string }> = [];
    
    // Look for file path indicators
    const filePatterns = [
      /(?:File|Path): ([^\n]+)\n```(?:\w+)?\n([\s\S]*?)```/g,
      /(?:src\/|components\/|pages\/|utils\/)([^\n:]+):\n```(?:\w+)?\n([\s\S]*?)```/g
    ];

    for (const pattern of filePatterns) {
      let match;
      while ((match = pattern.exec(content)) !== null) {
        files.push({
          path: match[1].trim(),
          content: match[2].trim()
        });
      }
    }

    return files;
  }
}

// Export singleton instance
export const aiService = new AIService();
