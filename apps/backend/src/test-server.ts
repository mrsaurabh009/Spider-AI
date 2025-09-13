import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';

import { logger } from '@/utils/logger';
import { errorHandler } from '@/middleware/errorHandler';
import { notFoundHandler } from '@/middleware/notFoundHandler';

// Import routes
import authRoutes from '@/routes/auth';
import aiRoutes from '@/routes/ai';
import projectRoutes from '@/routes/projects';
import userRoutes from '@/routes/users';
import templateRoutes from '@/routes/templates';
import exportRoutes from '@/routes/exports';

class TestSpiderAIServer {
  private app: express.Application;

  constructor() {
    this.app = express();
    this.initializeMiddleware();
    this.initializeRoutes();
    this.initializeErrorHandling();
  }

  private initializeMiddleware(): void {
    // Security middleware
    this.app.use(helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          scriptSrc: ["'self'"],
          imgSrc: ["'self'", 'data:', 'https:']
        }
      }
    }));

    // CORS configuration
    this.app.use(cors({
      origin: process.env.FRONTEND_URL || 'http://localhost:3001',
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
    }));

    // Compression
    this.app.use(compression());

    // Request parsing
    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true, limit: '10mb' }));

    // Logging
    this.app.use(morgan('combined', {
      stream: { write: (message) => logger.info(message.trim()) }
    }));

    // Rate limiting
    const limiter = rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // limit each IP to 100 requests per windowMs
      message: {
        error: 'Too many requests from this IP, please try again later.'
      },
      standardHeaders: true,
      legacyHeaders: false
    });
    this.app.use('/api/', limiter);

    // Health check
    this.app.get('/health', (req, res) => {
      res.json({
        status: 'ok',
        message: 'Spider AI Test Server is running!',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || 'development',
        version: '1.0.0',
        mode: 'test-server'
      });
    });
  }

  private initializeRoutes(): void {
    const router = express.Router();

    // Public routes
    router.use('/auth', authRoutes);
    router.use('/templates', templateRoutes);

    // AI routes (main functionality)
    router.use('/ai', aiRoutes);

    // Other routes (placeholders for now)
    router.use('/projects', projectRoutes);
    router.use('/users', userRoutes);
    router.use('/exports', exportRoutes);

    // Mount all routes under /api
    this.app.use('/api', router);

    // Root endpoint
    this.app.get('/', (req, res) => {
      res.json({
        message: 'Welcome to Spider AI! 🕷️',
        description: 'AI-Powered Full-Stack Web Development Platform',
        endpoints: {
          health: '/health',
          ai_generate: 'POST /api/ai/generate',
          ai_refine: 'POST /api/ai/refine',
          ai_component: 'POST /api/ai/component',
          ai_explain: 'POST /api/ai/explain'
        },
        docs: 'See README.md for full API documentation',
        status: 'ready'
      });
    });
  }

  private initializeErrorHandling(): void {
    // 404 handler
    this.app.use(notFoundHandler);

    // Global error handler
    this.app.use(errorHandler);
  }

  public start(): void {
    const port = process.env.PORT || 3000;
    
    try {
      this.app.listen(port, () => {
        console.log('');
        console.log('🕷️  ===================================');
        console.log('🚀  Spider AI Test Server Started!');
        console.log('🕷️  ===================================');
        console.log(`📍  Server: http://localhost:${port}`);
        console.log(`🏥  Health: http://localhost:${port}/health`);
        console.log(`🤖  AI API: http://localhost:${port}/api/ai/generate`);
        console.log(`🌍  Environment: ${process.env.NODE_ENV || 'development'}`);
        console.log(`🔑  Claude API: ${process.env.CLAUDE_API_KEY ? 'Configured' : 'Using Mock Service'}`);
        console.log('🕷️  ===================================');
        console.log('');
        
        logger.info('✅ Spider AI Test Server started successfully');
      });

      // Graceful shutdown
      process.on('SIGTERM', this.gracefulShutdown.bind(this));
      process.on('SIGINT', this.gracefulShutdown.bind(this));

    } catch (error) {
      logger.error('❌ Failed to start server:', error);
      process.exit(1);
    }
  }

  private gracefulShutdown(signal: string): void {
    logger.info(`🛑 Received ${signal}. Shutting down gracefully...`);
    process.exit(0);
  }
}

// Initialize and start test server
const testServer = new TestSpiderAIServer();
testServer.start();
