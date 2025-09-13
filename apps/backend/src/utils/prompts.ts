import { ProjectFramework, ProjectType, CodeGenerationRequest, SystemPromptConfig, UserPromptConfig } from '@/types/ai';

/**
 * Generate system prompt for different frameworks and project types
 */
export function generateSystemPrompt(framework: ProjectFramework, type: ProjectType | 'component'): string {
  const basePrompt = `You are Spider AI, an expert full-stack developer and AI coding assistant created by Samrat Industries & Technologies. You specialize in generating complete, production-ready applications from natural language descriptions.

CORE EXPERTISE:
- Modern web development frameworks (React, Vue, Angular, Next.js, etc.)
- Full-stack architecture and design patterns
- Database design and implementation
- API development and integration
- UI/UX best practices and responsive design
- Security and performance optimization
- TypeScript and modern JavaScript

GENERATION PRINCIPLES:
1. Generate complete, functional, production-ready code
2. Follow modern best practices and industry standards
3. Ensure code is well-structured, readable, and maintainable
4. Include proper error handling and validation
5. Implement responsive design and accessibility
6. Use TypeScript for type safety when applicable
7. Include comprehensive comments and documentation
8. Follow the specific framework's conventions and patterns

${getFrameworkSpecificPrompt(framework)}

${getProjectTypeSpecificPrompt(type)}

RESPONSE FORMAT:
Always structure your response as a complete application with:
1. Frontend code (main component/page files)
2. Backend code (if requested)
3. Database schema (if needed)
4. Package.json with proper dependencies
5. File structure with individual components

Use this JSON structure for your response:
\`\`\`json
{
  "framework": "${framework}",
  "frontend": "// Main frontend code here",
  "backend": "// Backend code if needed",
  "database": "// Database schema if needed", 
  "packageJson": {
    "name": "generated-app",
    "version": "1.0.0",
    "dependencies": {}
  },
  "files": [
    {
      "path": "src/components/Component.tsx",
      "content": "// Component code"
    }
  ]
}
\`\`\`

IMPORTANT RULES:
- Generate complete, working applications, not just snippets
- Include all necessary imports and dependencies
- Ensure proper file structure and organization
- Use modern, clean, and efficient code
- Include responsive styling (Tailwind CSS preferred)
- Add proper TypeScript types throughout
- Include error handling and loading states
- Make the code production-ready and scalable`;

  return basePrompt;
}

/**
 * Generate user prompt from request data
 */
export function generateUserPrompt(request: CodeGenerationRequest): string {
  const { prompt, framework, type, context } = request;

  let userPrompt = `Generate a complete ${framework.toLowerCase()} ${type} application based on this description:

${prompt}

REQUIREMENTS:
`;

  // Add framework-specific requirements
  userPrompt += `- Framework: ${framework}\n`;
  userPrompt += `- Project Type: ${type}\n`;

  // Add optional features
  if (request.includeBackend) {
    userPrompt += `- Include backend API with Node.js/Express\n`;
  }
  if (request.includeDatabase) {
    userPrompt += `- Include database schema (PostgreSQL/Prisma)\n`;
  }
  if (request.includeAuth) {
    userPrompt += `- Include authentication system\n`;
  }
  if (request.includeTests) {
    userPrompt += `- Include unit tests\n`;
  }

  // Add context if provided
  if (context) {
    if (context.requirements?.length) {
      userPrompt += `\nSPECIFIC REQUIREMENTS:\n`;
      context.requirements.forEach(req => {
        userPrompt += `- ${req}\n`;
      });
    }

    if (context.constraints?.length) {
      userPrompt += `\nCONSTRAINTS:\n`;
      context.constraints.forEach(constraint => {
        userPrompt += `- ${constraint}\n`;
      });
    }

    if (context.style) {
      userPrompt += `\nDESIGN STYLE: ${context.style}\n`;
    }

    if (context.features?.length) {
      userPrompt += `\nFEATURES TO INCLUDE:\n`;
      context.features.forEach(feature => {
        userPrompt += `- ${feature}\n`;
      });
    }

    if (context.existingCode) {
      userPrompt += `\nEXISTING CODE TO BUILD UPON:\n\`\`\`\n${context.existingCode}\n\`\`\`\n`;
    }
  }

  userPrompt += `\nPlease generate a complete, production-ready application with clean, modern code following best practices. Ensure the application is fully functional and includes all necessary files and dependencies.`;

  return userPrompt;
}

/**
 * Get framework-specific prompt additions
 */
function getFrameworkSpecificPrompt(framework: ProjectFramework): string {
  const frameworkPrompts = {
    [ProjectFramework.REACT]: `
REACT EXPERTISE:
- Use functional components with hooks
- Implement proper state management (useState, useEffect, useContext)
- Follow React best practices and patterns
- Use TypeScript for all components
- Implement proper component composition
- Include proper prop types and interfaces
- Use modern React patterns (custom hooks, context, etc.)
- Ensure proper error boundaries and loading states`,

    [ProjectFramework.NEXTJS]: `
NEXT.JS EXPERTISE:
- Use App Router (app directory) for Next.js 13+
- Implement proper SSR/SSG where appropriate
- Use Next.js built-in features (Image, Link, Head, etc.)
- Follow Next.js file-based routing conventions
- Implement proper API routes
- Use Next.js optimization features
- Include proper metadata and SEO
- Implement proper client/server component patterns`,

    [ProjectFramework.VUE]: `
VUE.JS EXPERTISE:
- Use Vue 3 Composition API
- Implement proper reactivity with ref/reactive
- Follow Vue.js best practices and patterns
- Use TypeScript with Vue components
- Implement proper component structure
- Use Vue Router for navigation
- Include proper template syntax and directives
- Implement proper lifecycle management`,

    [ProjectFramework.ANGULAR]: `
ANGULAR EXPERTISE:
- Use Angular 15+ with standalone components
- Implement proper dependency injection
- Follow Angular style guide and best practices
- Use TypeScript throughout
- Implement proper reactive forms
- Use Angular CLI conventions
- Include proper services and guards
- Implement proper change detection strategies`,

    [ProjectFramework.SVELTE]: `
SVELTE EXPERTISE:
- Use SvelteKit for full-stack applications
- Implement proper reactivity with Svelte stores
- Follow Svelte best practices and conventions
- Use TypeScript for type safety
- Implement proper component lifecycle
- Use Svelte's built-in animations and transitions
- Include proper routing with SvelteKit
- Implement proper state management`,

    [ProjectFramework.VANILLA]: `
VANILLA JS EXPERTISE:
- Use modern ES6+ JavaScript features
- Implement proper modular architecture
- Use TypeScript for type safety
- Follow modern web standards
- Implement proper DOM manipulation
- Use modern CSS features (Grid, Flexbox, Custom Properties)
- Include proper bundling configuration
- Implement proper event handling and state management`
  };

  return frameworkPrompts[framework] || frameworkPrompts[ProjectFramework.REACT];
}

/**
 * Get project type-specific prompt additions
 */
function getProjectTypeSpecificPrompt(type: ProjectType | 'component'): string {
  const typePrompts = {
    [ProjectType.WEBAPP]: `
WEB APPLICATION FOCUS:
- Create a complete web application with multiple pages/views
- Include navigation and routing
- Implement proper user interface and user experience
- Add interactive features and functionality
- Include responsive design for all devices
- Implement proper state management
- Add loading states and error handling`,

    [ProjectType.DASHBOARD]: `
DASHBOARD FOCUS:
- Create a comprehensive admin/analytics dashboard
- Include data visualization (charts, graphs, tables)
- Implement proper layout with sidebar navigation
- Add filtering and search functionality
- Include responsive grid layout
- Implement real-time data updates
- Add export and reporting features`,

    [ProjectType.ECOMMERCE]: `
E-COMMERCE FOCUS:
- Create a complete online store interface
- Include product catalog and search functionality
- Implement shopping cart and checkout process
- Add user authentication and account management
- Include payment integration placeholder
- Implement product filtering and sorting
- Add responsive product grid and details pages`,

    [ProjectType.LANDING]: `
LANDING PAGE FOCUS:
- Create a high-converting landing page
- Include hero section with clear value proposition
- Add features section with benefits
- Include testimonials and social proof
- Add call-to-action buttons throughout
- Implement smooth scrolling and animations
- Ensure mobile-first responsive design`,

    [ProjectType.BLOG]: `
BLOG FOCUS:
- Create a complete blogging platform
- Include article listing and detail pages
- Implement search and category filtering
- Add comment system placeholder
- Include author profiles and bio sections
- Implement pagination and infinite scroll
- Add RSS feed and social sharing`,

    [ProjectType.PORTFOLIO]: `
PORTFOLIO FOCUS:
- Create a professional portfolio website
- Include project showcase with detailed case studies
- Add about section with skills and experience
- Include contact form and social links
- Implement smooth animations and transitions
- Add testimonials and recommendations section
- Ensure professional and clean design`,

    [ProjectType.SAAS]: `
SAAS FOCUS:
- Create a Software as a Service application interface
- Include user onboarding and tutorial flow
- Implement subscription and billing placeholder
- Add user dashboard with usage analytics
- Include settings and account management
- Implement team collaboration features
- Add API integration and webhook support`,

    'component': `
COMPONENT FOCUS:
- Create reusable, well-documented components
- Include proper prop interfaces and types
- Implement multiple variants and states
- Add accessibility features (ARIA labels, etc.)
- Include proper error handling
- Implement responsive behavior
- Add comprehensive examples and usage docs`
  };

  return typePrompts[type as keyof typeof typePrompts] || typePrompts[ProjectType.WEBAPP];
}

/**
 * Generate prompt for code refinement
 */
export function generateRefinementPrompt(existingCode: string, refinementRequest: string): string {
  return `You are refining existing code based on user feedback. Analyze the current code and make the requested improvements while maintaining functionality and code quality.

EXISTING CODE:
\`\`\`
${existingCode}
\`\`\`

REFINEMENT REQUEST:
${refinementRequest}

INSTRUCTIONS:
1. Understand the current code structure and functionality
2. Make the requested changes while preserving working features
3. Improve code quality and maintainability
4. Follow the same patterns and conventions as the original code
5. Add comments explaining any significant changes
6. Ensure the refined code is production-ready

Please provide the complete refined code with your improvements.`;
}

/**
 * Generate prompt for code explanation
 */
export function generateExplanationPrompt(code: string): string {
  return `Analyze and explain the following code in detail. Provide a comprehensive explanation that covers:

1. Overall purpose and functionality
2. Key components and their roles
3. Architecture and design patterns used
4. Important features and capabilities
5. How different parts work together
6. Notable implementation details
7. Best practices demonstrated

CODE TO EXPLAIN:
\`\`\`
${code}
\`\`\`

Please provide a clear, educational explanation that would help both beginners and experienced developers understand this code.`;
}

/**
 * Generate prompt templates for different scenarios
 */
export const promptTemplates = {
  fullApplication: {
    system: (framework: ProjectFramework, type: ProjectType) => generateSystemPrompt(framework, type),
    user: (request: CodeGenerationRequest) => generateUserPrompt(request)
  },

  componentGeneration: {
    system: (framework: ProjectFramework) => generateSystemPrompt(framework, 'component'),
    user: (componentName: string, description: string) => 
      `Generate a ${componentName} component with the following specifications:\n\n${description}\n\nEnsure the component is reusable, well-typed, and follows best practices.`
  },

  codeRefinement: {
    system: () => `You are a senior developer focused on code refinement and improvement. Your task is to enhance existing code based on specific feedback while maintaining functionality and improving quality.`,
    user: (existingCode: string, feedback: string) => generateRefinementPrompt(existingCode, feedback)
  },

  codeExplanation: {
    system: () => `You are a technical educator who excels at explaining code in a clear, comprehensive manner. Break down complex code into understandable concepts.`,
    user: (code: string) => generateExplanationPrompt(code)
  }
};

/**
 * Validate and sanitize prompts
 */
export function validatePrompt(prompt: string): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!prompt || prompt.trim().length === 0) {
    errors.push('Prompt cannot be empty');
  }

  if (prompt.length > 10000) {
    errors.push('Prompt is too long (max 10,000 characters)');
  }

  if (prompt.length < 10) {
    errors.push('Prompt is too short (min 10 characters)');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}
