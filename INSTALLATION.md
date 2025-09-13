# Spider AI - Installation & Setup Guide

## 📋 Prerequisites

Before setting up Spider AI, ensure you have the following installed on your system:

### Required Software
- **Node.js** 18.0.0 or higher ([Download](https://nodejs.org/))
- **npm** 9.0.0 or higher (comes with Node.js)
- **PostgreSQL** 14.0 or higher ([Download](https://www.postgresql.org/download/))
- **Redis** 6.0 or higher ([Download](https://redis.io/download))
- **Git** ([Download](https://git-scm.com/downloads))

### API Keys & Services
- **Claude API Key** from Anthropic ([Get API Key](https://console.anthropic.com/))
- **AWS Account** (optional, for file storage)
- **SMTP Email Service** (optional, for notifications)

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/mrsaurabh009/spider-ai.git
cd spider-ai
```

### 2. Install Dependencies
```bash
# Install root dependencies
npm install

# Install backend dependencies
cd apps/backend
npm install

# Install frontend dependencies
cd ../frontend
npm install

# Return to root
cd ../..
```

### 3. Environment Configuration
```bash
# Copy environment template
cp .env.example .env

# Edit environment variables
nano .env  # or use your preferred editor
```

**Required Environment Variables:**
```env
# Database (Update with your PostgreSQL credentials)
DATABASE_URL="postgresql://username:password@localhost:5432/spider_ai"
REDIS_URL="redis://localhost:6379"

# Claude API Key (Replace with your actual key)
CLAUDE_API_KEY="sk-or-v1-your-actual-key-here"

# JWT Secret (Generate a strong secret)
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"

# Application URLs
FRONTEND_URL="http://localhost:3001"
BACKEND_URL="http://localhost:3000"
```

### 4. Database Setup
```bash
# Start PostgreSQL service
# On Windows: Start PostgreSQL from Services
# On macOS: brew services start postgresql
# On Linux: sudo systemctl start postgresql

# Create database
createdb spider_ai

# Generate Prisma client and run migrations
npm run db:setup
```

### 5. Start Redis
```bash
# On Windows: Start Redis from Services or run redis-server
# On macOS: brew services start redis
# On Linux: sudo systemctl start redis
redis-server
```

### 6. Start Development Servers
```bash
# Start both backend and frontend
npm run dev

# Or start individually:
npm run dev:backend  # Starts on port 3000
npm run dev:frontend # Starts on port 3001
```

### 7. Access the Application
- **Frontend**: http://localhost:3001
- **Backend API**: http://localhost:3000
- **API Health Check**: http://localhost:3000/health

## 🐳 Docker Setup (Alternative)

### Prerequisites
- **Docker** and **Docker Compose** installed

### Quick Docker Start
```bash
# Clone repository
git clone https://github.com/mrsaurabh009/spider-ai.git
cd spider-ai

# Copy environment file
cp .env.example .env

# Edit .env with your Claude API key
nano .env

# Build and start all services
docker-compose up --build -d

# Check service status
docker-compose ps

# View logs
docker-compose logs -f
```

### Docker Services
- **Frontend**: http://localhost:3001
- **Backend**: http://localhost:3000
- **PostgreSQL**: localhost:5432
- **Redis**: localhost:6379
- **Prometheus** (optional): http://localhost:9090
- **Grafana** (optional): http://localhost:3002

## ⚙️ Detailed Configuration

### Database Configuration
```bash
# Create a new PostgreSQL user and database
sudo -u postgres psql

CREATE USER spider_user WITH PASSWORD 'spider_password';
CREATE DATABASE spider_ai OWNER spider_user;
GRANT ALL PRIVILEGES ON DATABASE spider_ai TO spider_user;
\\q

# Update DATABASE_URL in .env
DATABASE_URL="postgresql://spider_user:spider_password@localhost:5432/spider_ai"
```

### Redis Configuration
```bash
# Basic Redis configuration (redis.conf)
# For production, configure password and other security settings

# Test Redis connection
redis-cli ping
# Should return: PONG
```

### Claude API Setup
1. Go to [Anthropic Console](https://console.anthropic.com/)
2. Create an account or sign in
3. Generate an API key
4. Update `CLAUDE_API_KEY` in your `.env` file
5. **Important**: Keep your API key secure and never commit it to version control

### AWS S3 Setup (Optional)
```env
# Add to .env for file uploads and exports
AWS_ACCESS_KEY_ID="your-access-key"
AWS_SECRET_ACCESS_KEY="your-secret-key"
AWS_BUCKET_NAME="spider-ai-storage"
AWS_REGION="us-east-1"
```

### Email Configuration (Optional)
```env
# SMTP configuration for notifications
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"
```

## 🛠️ Development Setup

### Code Editor Setup
**Recommended: VS Code with extensions:**
- TypeScript and JavaScript
- Prisma
- Tailwind CSS IntelliSense
- ESLint
- Prettier

### Git Hooks Setup
```bash
# Install Husky for git hooks
npx husky install

# Add pre-commit hooks
npx husky add .husky/pre-commit "npm run lint && npm run type-check"
```

### Database Management
```bash
# Prisma commands
npm run db:generate    # Generate Prisma client
npm run db:migrate     # Run migrations
npm run db:seed        # Seed database
npm run db:studio      # Open Prisma Studio
npm run db:reset       # Reset database (⚠️ Deletes data)
```

## 🧪 Testing Setup

### Run Tests
```bash
# Run all tests
npm test

# Run backend tests
npm run test --workspace=apps/backend

# Run frontend tests
npm run test --workspace=apps/frontend

# Run tests with coverage
npm run test:coverage

# Run E2E tests
npm run test:e2e
```

### Test Database Setup
```env
# Add to .env.test
DATABASE_URL="postgresql://username:password@localhost:5432/spider_ai_test"
NODE_ENV="test"
```

## 📊 Monitoring Setup (Optional)

### Prometheus & Grafana
```bash
# Start monitoring stack
docker-compose --profile monitoring up -d

# Access Grafana: http://localhost:3002
# Default credentials: admin/admin

# Access Prometheus: http://localhost:9090
```

## 🚀 Production Deployment

### Environment Variables for Production
```env
NODE_ENV="production"
DATABASE_URL="your-production-database-url"
REDIS_URL="your-production-redis-url"
JWT_SECRET="your-production-jwt-secret"
CLAUDE_API_KEY="your-production-claude-key"

# Add production domains
FRONTEND_URL="https://yourapp.com"
BACKEND_URL="https://api.yourapp.com"
```

### Build for Production
```bash
# Build all applications
npm run build

# Start production server
npm start
```

### Deployment Platforms

#### Vercel (Frontend)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy frontend
cd apps/frontend
vercel

# Set environment variables in Vercel dashboard
```

#### Railway (Full-stack)
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```

#### AWS/DigitalOcean (Docker)
```bash
# Build for production
docker-compose -f docker-compose.prod.yml up --build -d

# Or use Docker Hub
docker build -t spider-ai .
docker push your-registry/spider-ai
```

## 🔧 Troubleshooting

### Common Issues

#### Port Already in Use
```bash
# Kill process on port 3000
npx kill-port 3000

# Or use different ports in .env
PORT=3005
```

#### Database Connection Issues
```bash
# Check PostgreSQL is running
pg_isready

# Check database exists
psql -h localhost -U your_username -d spider_ai

# Reset database if corrupted
npm run db:reset
```

#### Redis Connection Issues
```bash
# Check Redis is running
redis-cli ping

# Restart Redis service
sudo systemctl restart redis
```

#### Dependencies Issues
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Performance Issues
- Monitor memory usage: `htop` or Task Manager
- Check database queries: Use Prisma Studio
- Monitor API response times: Check backend logs
- Use Redis for caching frequently requested data

### API Rate Limits
- Monitor Claude API usage in Anthropic Console
- Implement request queuing for high traffic
- Use caching to reduce API calls

## 📚 Additional Resources

### Documentation Links
- [Prisma Documentation](https://www.prisma.io/docs/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Claude API Documentation](https://docs.anthropic.com/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

### Community & Support
- [GitHub Issues](https://github.com/mrsaurabh009/spider-ai/issues)
- [Discussions](https://github.com/mrsaurabh009/spider-ai/discussions)
- [Twitter: @SpiderAI](https://twitter.com/spiderai)

## 🆘 Getting Help

1. Check this installation guide first
2. Search existing [GitHub Issues](https://github.com/mrsaurabh009/spider-ai/issues)
3. Create a new issue with:
   - Operating system and version
   - Node.js version
   - Error messages and logs
   - Steps to reproduce

---

**Samrat Industries & Technologies**  
*Building the Future of AI-Powered Development*

For additional support, contact: support@samrat-tech.com
