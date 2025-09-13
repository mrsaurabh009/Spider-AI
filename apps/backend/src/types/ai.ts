export enum ProjectFramework {
  REACT = 'REACT',
  NEXTJS = 'NEXTJS',
  VUE = 'VUE',
  NUXT = 'NUXT',
  ANGULAR = 'ANGULAR',
  SVELTE = 'SVELTE',
  VANILLA = 'VANILLA'
}

export enum ProjectType {
  WEBAPP = 'webapp',
  DASHBOARD = 'dashboard',
  ECOMMERCE = 'ecommerce',
  BLOG = 'blog',
  PORTFOLIO = 'portfolio',
  LANDING = 'landing',
  SAAS = 'saas',
  MOBILE = 'mobile',
  API = 'api',
  CMS = 'cms',
  COMPONENT = 'component',
  CUSTOM = 'custom'
}

export interface CodeGenerationRequest {
  prompt: string;
  framework: ProjectFramework;
  type: ProjectType;
  context?: {
    existingCode?: string;
    requirements?: string[];
    constraints?: string[];
    style?: 'modern' | 'minimal' | 'corporate' | 'creative';
    features?: string[];
  };
  includeBackend?: boolean;
  includeDatabase?: boolean;
  includeAuth?: boolean;
  includeTests?: boolean;
}

export interface GeneratedCode {
  framework: ProjectFramework;
  frontend: string;
  backend?: string;
  database?: string;
  packageJson: any;
  files: Array<{
    path: string;
    content: string;
  }>;
  usage: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  model: string;
  timestamp: string;
}

export interface CodeValidation {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  suggestions: string[];
}

export interface PromptTemplate {
  system: string;
  user: string;
  variables: string[];
}

export interface AIGenerationOptions {
  model?: string;
  maxTokens?: number;
  temperature?: number;
  topP?: number;
  stream?: boolean;
}

// Prompt Engineering Types
export interface SystemPromptConfig {
  role: string;
  expertise: string[];
  constraints: string[];
  format: string;
  examples?: string[];
}

export interface UserPromptConfig {
  request: string;
  context?: string;
  framework: ProjectFramework;
  type: ProjectType;
  requirements?: string[];
  examples?: string[];
}

// Code Generation Templates
export interface CodeTemplate {
  id: string;
  name: string;
  framework: ProjectFramework;
  type: ProjectType;
  template: string;
  variables: string[];
  dependencies: string[];
  features: string[];
}

export interface TemplateVariable {
  name: string;
  type: 'string' | 'boolean' | 'array' | 'object';
  required: boolean;
  default?: any;
  description: string;
}

// AI Response Types
export interface AIResponse {
  content: string;
  usage: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  model: string;
  finishReason: string;
}

export interface StreamingAIResponse {
  delta: string;
  isComplete: boolean;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

// Code Analysis Types
export interface CodeAnalysis {
  framework: ProjectFramework;
  components: string[];
  dependencies: string[];
  complexity: 'low' | 'medium' | 'high';
  patterns: string[];
  security: {
    score: number;
    issues: string[];
  };
  performance: {
    score: number;
    suggestions: string[];
  };
}

export interface CodeMetrics {
  linesOfCode: number;
  files: number;
  functions: number;
  classes: number;
  components: number;
  dependencies: number;
}

// Error Types
export class AIServiceError extends Error {
  constructor(
    message: string,
    public code: string,
    public details?: any
  ) {
    super(message);
    this.name = 'AIServiceError';
  }
}

export class CodeGenerationError extends AIServiceError {
  constructor(message: string, details?: any) {
    super(message, 'CODE_GENERATION_ERROR', details);
  }
}

export class ValidationError extends AIServiceError {
  constructor(message: string, details?: any) {
    super(message, 'VALIDATION_ERROR', details);
  }
}

export class RateLimitError extends AIServiceError {
  constructor(message: string, details?: any) {
    super(message, 'RATE_LIMIT_ERROR', details);
  }
}
