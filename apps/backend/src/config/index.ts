// Simple environment validation
function getEnv(key: string, defaultValue?: string): string {
  const value = process.env[key];
  if (!value && !defaultValue) {
    throw new Error(`Environment variable ${key} is required`);
  }
  return value || defaultValue!;
}

function getEnvNumber(key: string, defaultValue?: number): number {
  const value = process.env[key];
  if (!value && defaultValue === undefined) {
    throw new Error(`Environment variable ${key} is required`);
  }
  return value ? parseInt(value, 10) : defaultValue!;
}

// Environment variables
const env = {
  NODE_ENV: getEnv('NODE_ENV', 'development') as 'development' | 'production' | 'test',
  PORT: getEnvNumber('PORT', 3000),
  
  // Database (optional in test mode)
  DATABASE_URL: process.env.DATABASE_URL || 'postgresql://test:test@localhost:5432/test',
  REDIS_URL: process.env.REDIS_URL || 'redis://localhost:6379',
  
  // AI Service (optional in test mode)
  CLAUDE_API_KEY: process.env.CLAUDE_API_KEY || 'test-key',
  
  // JWT
  JWT_SECRET: process.env.JWT_SECRET || 'default-test-jwt-secret-not-for-production',
  JWT_EXPIRES_IN: getEnv('JWT_EXPIRES_IN', '7d'),
  REFRESH_TOKEN_EXPIRES_IN: getEnv('REFRESH_TOKEN_EXPIRES_IN', '30d'),
  
  // URLs
  FRONTEND_URL: getEnv('FRONTEND_URL', 'http://localhost:3001'),
  BACKEND_URL: getEnv('BACKEND_URL', 'http://localhost:3000'),
  
  // AWS (optional)
  AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
  AWS_BUCKET_NAME: process.env.AWS_BUCKET_NAME,
  AWS_REGION: getEnv('AWS_REGION', 'us-east-1'),
  
  // Email (optional)
  SMTP_HOST: process.env.SMTP_HOST,
  SMTP_PORT: process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : undefined,
  SMTP_USER: process.env.SMTP_USER,
  SMTP_PASS: process.env.SMTP_PASS,
  
  // Rate Limiting
  RATE_LIMIT_WINDOW_MS: getEnvNumber('RATE_LIMIT_WINDOW_MS', 900000),
  RATE_LIMIT_MAX_REQUESTS: getEnvNumber('RATE_LIMIT_MAX_REQUESTS', 100),
  
  // File Upload
  MAX_FILE_SIZE: getEnv('MAX_FILE_SIZE', '50MB'),
  ALLOWED_FILE_TYPES: getEnv('ALLOWED_FILE_TYPES', 'image/jpeg,image/png,image/gif,text/plain,application/json'),
  
  // Logging
  LOG_LEVEL: getEnv('LOG_LEVEL', 'info') as 'error' | 'warn' | 'info' | 'debug',
  DEBUG: process.env.DEBUG,
};

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
