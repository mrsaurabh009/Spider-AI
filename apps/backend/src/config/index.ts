import { z } from 'zod';

// Environment schema validation
const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().transform(Number).default('3000'),
  
  // Database
  DATABASE_URL: z.string().min(1, 'Database URL is required'),
  REDIS_URL: z.string().min(1, 'Redis URL is required'),
  
  // AI Service
  CLAUDE_API_KEY: z.string().min(1, 'Claude API key is required'),
  
  // JWT
  JWT_SECRET: z.string().min(1, 'JWT secret is required'),
  JWT_EXPIRES_IN: z.string().default('7d'),
  REFRESH_TOKEN_EXPIRES_IN: z.string().default('30d'),
  
  // URLs
  FRONTEND_URL: z.string().url().default('http://localhost:3001'),
  BACKEND_URL: z.string().url().default('http://localhost:3000'),
  
  // AWS (optional)
  AWS_ACCESS_KEY_ID: z.string().optional(),
  AWS_SECRET_ACCESS_KEY: z.string().optional(),
  AWS_BUCKET_NAME: z.string().optional(),
  AWS_REGION: z.string().default('us-east-1'),
  
  // Email (optional)
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.string().transform(Number).optional(),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),
  
  // Rate Limiting
  RATE_LIMIT_WINDOW_MS: z.string().transform(Number).default('900000'), // 15 minutes
  RATE_LIMIT_MAX_REQUESTS: z.string().transform(Number).default('100'),
  
  // File Upload
  MAX_FILE_SIZE: z.string().default('50MB'),
  ALLOWED_FILE_TYPES: z.string().default('image/jpeg,image/png,image/gif,text/plain,application/json'),
  
  // Logging
  LOG_LEVEL: z.enum(['error', 'warn', 'info', 'debug']).default('info'),
  DEBUG: z.string().optional(),
});

// Validate environment variables
const env = envSchema.parse(process.env);

// Application configuration
export const config = {
  env: env.NODE_ENV,
  port: env.PORT,
  
  // Database configuration
  database: {
    url: env.DATABASE_URL,
  },
  
  // Redis configuration
  redis: {
    url: env.REDIS_URL,
  },
  
  // AI service configuration
  ai: {
    claude: {
      apiKey: env.CLAUDE_API_KEY,
      model: 'claude-3-sonnet-20240229',
      maxTokens: 4096,
      temperature: 0.7,
    },
  },
  
  // Authentication configuration
  auth: {
    jwt: {
      secret: env.JWT_SECRET,
      expiresIn: env.JWT_EXPIRES_IN,
      refreshExpiresIn: env.REFRESH_TOKEN_EXPIRES_IN,
    },
    bcrypt: {
      saltRounds: 12,
    },
  },
  
  // URL configuration
  frontend: {
    url: env.FRONTEND_URL,
  },
  backend: {
    url: env.BACKEND_URL,
  },
  
  // AWS configuration
  aws: {
    accessKeyId: env.AWS_ACCESS_KEY_ID,
    secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
    bucketName: env.AWS_BUCKET_NAME,
    region: env.AWS_REGION,
  },
  
  // Email configuration
  email: {
    smtp: {
      host: env.SMTP_HOST,
      port: env.SMTP_PORT || 587,
      user: env.SMTP_USER,
      password: env.SMTP_PASS,
    },
    from: env.SMTP_USER || 'noreply@spider-ai.com',
  },
  
  // Rate limiting configuration
  rateLimit: {
    windowMs: env.RATE_LIMIT_WINDOW_MS,
    maxRequests: env.RATE_LIMIT_MAX_REQUESTS,
  },
  
  // File upload configuration
  upload: {
    maxFileSize: env.MAX_FILE_SIZE,
    allowedTypes: env.ALLOWED_FILE_TYPES.split(',').map(type => type.trim()),
    uploadDir: 'uploads',
    exportDir: 'exports',
  },
  
  // Logging configuration
  logging: {
    level: env.LOG_LEVEL,
    format: env.NODE_ENV === 'production' ? 'json' : 'combined',
  },
  
  // Features flags
  features: {
    emailVerification: true,
    socialLogin: false,
    fileUpload: true,
    codeGeneration: true,
    projectExport: true,
    templateLibrary: true,
  },
  
  // AI generation limits
  limits: {
    free: {
      tokensPerMonth: 10000,
      projectsPerUser: 3,
      exportsPerMonth: 5,
    },
    pro: {
      tokensPerMonth: 100000,
      projectsPerUser: 50,
      exportsPerMonth: 100,
    },
    enterprise: {
      tokensPerMonth: 1000000,
      projectsPerUser: -1, // Unlimited
      exportsPerMonth: -1, // Unlimited
    },
  },
} as const;

// Type definitions
export type Config = typeof config;
export type Environment = typeof env.NODE_ENV;
export type UserPlan = 'free' | 'pro' | 'enterprise';
