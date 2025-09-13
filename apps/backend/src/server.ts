import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import { createServer } from 'http';
import { Server } from 'socket.io';
import rateLimit from 'express-rate-limit';

import { config } from '@/config';
import { logger } from '@/utils/logger';
import { connectDatabase } from '@/database/connection';
import { connectRedis } from '@/utils/redis';
import { errorHandler } from '@/middleware/errorHandler';
import { notFoundHandler } from '@/middleware/notFoundHandler';
import { authMiddleware } from '@/middleware/auth';

// Import routes
import authRoutes from '@/routes/auth';
import projectRoutes from '@/routes/projects';
import aiRoutes from '@/routes/ai';
import userRoutes from '@/routes/users';
import templateRoutes from '@/routes/templates';
import exportRoutes from '@/routes/exports';

// Import socket handlers
import { initializeSocketIO } from '@/services/socket';

class SpiderAIServer {
  private app: express.Application;
  private server: any;
  private io: Server;

  constructor() {
    this.app = express();
    this.server = createServer(this.app);
    this.io = new Server(this.server, {
      cors: {
        origin: config.frontend.url,
        methods: ['GET', 'POST'],
        credentials: true
      }
    });

    this.initializeMiddleware();
    this.initializeRoutes();
    this.initializeErrorHandling();
    this.initializeSocket();
  }

  private initializeMiddleware(): void {
    // Security middleware
    this.app.use(helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: [\"'self'\"],
          styleSrc: [\"'self'\", \"'unsafe-inline'\"],
          scriptSrc: [\"'self'\"],
          imgSrc: [\"'self'\", 'data:', 'https:']
        }
      }
    }));

    // CORS configuration
    this.app.use(cors({
      origin: config.frontend.url,
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
    if (config.env !== 'test') {
      this.app.use(morgan('combined', {
        stream: { write: (message) => logger.info(message.trim()) }
      }));
    }

    // Rate limiting
    const limiter = rateLimit({
      windowMs: config.rateLimit.windowMs,
      max: config.rateLimit.maxRequests,
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
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: config.env,
        version: process.env.npm_package_version || '1.0.0'
      });
    });
  }

  private initializeRoutes(): void {
    const router = express.Router();

    // Public routes
    router.use('/auth', authRoutes);
    router.use('/templates', templateRoutes);

    // Protected routes
    router.use('/users', authMiddleware, userRoutes);
    router.use('/projects', authMiddleware, projectRoutes);
    router.use('/ai', authMiddleware, aiRoutes);
    router.use('/exports', authMiddleware, exportRoutes);

    // Mount all routes under /api
    this.app.use('/api', router);

    // Serve static files for exports
    this.app.use('/exports', express.static('exports'));
  }

  private initializeErrorHandling(): void {
    // 404 handler
    this.app.use(notFoundHandler);

    // Global error handler
    this.app.use(errorHandler);
  }

  private initializeSocket(): void {
    initializeSocketIO(this.io);
  }

  public async start(): Promise<void> {
    try {
      // Connect to database
      await connectDatabase();
      logger.info('✅ Database connected successfully');

      // Connect to Redis
      await connectRedis();
      logger.info('✅ Redis connected successfully');

      // Start server
      this.server.listen(config.port, () => {
        logger.info(`🚀 Spider AI Server running on port ${config.port}`);
        logger.info(`🌍 Environment: ${config.env}`);
        logger.info(`📱 Frontend URL: ${config.frontend.url}`);
        
        if (config.env === 'development') {
          logger.info(`📖 API Documentation: http://localhost:${config.port}/api-docs`);
          logger.info(`🔍 Database Studio: npx prisma studio`);
        }
      });

      // Graceful shutdown
      process.on('SIGTERM', this.gracefulShutdown.bind(this));
      process.on('SIGINT', this.gracefulShutdown.bind(this));

    } catch (error) {
      logger.error('❌ Failed to start server:', error);
      process.exit(1);
    }
  }

  private async gracefulShutdown(signal: string): Promise<void> {
    logger.info(`🛑 Received ${signal}. Starting graceful shutdown...`);

    this.server.close(() => {
      logger.info('✅ HTTP server closed');
      process.exit(0);
    });

    // Force close server after 30s
    setTimeout(() => {
      logger.error('❌ Could not close connections in time, forcefully shutting down');
      process.exit(1);
    }, 30000);
  }
}

// Initialize and start server
const server = new SpiderAIServer();
server.start().catch((error) => {
  logger.error('❌ Failed to start Spider AI Server:', error);
  process.exit(1);
});

export default server;
