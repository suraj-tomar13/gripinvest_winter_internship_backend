# Mini Investment Platform - Grip Invest Winter Internship 2025

A full-stack investment platform built with Node.js, React, and MySQL, featuring AI-powered insights and comprehensive portfolio management.

## 🚀 Features

### Backend Features
- **User Authentication**: JWT-based authentication with signup, login, and password strength analysis
- **Investment Products CRUD**: Admin can create, update, delete investment products
- **Investment Management**: Users can invest in products with portfolio tracking
- **Transaction Logging**: Comprehensive API call logging with error tracking
- **AI Integration**: Password strength suggestions, product descriptions, portfolio insights
- **Health Monitoring**: Health check endpoints for service monitoring

### Frontend Features
- **Landing Page**: Welcome page with authentication options
- **Dashboard**: Portfolio overview with AI insights and risk distribution charts
- **Products**: Browse and filter investment products with detailed views
- **Investments**: Make investments and view portfolio with interactive charts
- **Transaction Logs**: View API logs with filtering and error summaries
- **Profile Management**: Update user details and risk appetite with AI recommendations
- **Responsive Design**: Mobile-friendly interface with TailwindCSS

### DevOps Features
- **Docker Containerization**: Complete containerized setup for all services
- **Health Checks**: Automated health monitoring for all containers
- **Database Seeding**: Automated database initialization with sample data
- **Environment Configuration**: Secure environment variable management

## 🛠️ Tech Stack

### Backend
- **Node.js** with Express.js
- **MySQL** database with connection pooling
- **JWT** for authentication
- **bcrypt** for password hashing
- **Jest** for testing

### Frontend
- **React 18** with functional components and hooks
- **TailwindCSS** for styling
- **Recharts** for data visualization
- **React Testing Library** for testing

### DevOps
- **Docker** and **Docker Compose**
- **Nginx** for frontend serving
- **MySQL 8.0** for database

## 📋 Prerequisites

- Docker and Docker Compose
- Node.js 18+ (for local development)
- Git

## 🚀 Quick Start

### Using Docker (Recommended)

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/gripinvest_winter_internship_backend.git
   cd gripinvest_winter_internship_backend
   ```

2. **Start all services**
   ```bash
   docker-compose up --build
   ```

3. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - Database: localhost:3306

### Local Development

1. **Backend Setup**
   ```bash
   cd backend
   npm install
   cp env.example .env
   # Edit .env with your database credentials
   npm run dev
   ```

2. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   npm start
   ```

3. **Database Setup**
   ```bash
   # Start MySQL container
   docker run --name mysql -e MYSQL_ROOT_PASSWORD=rootpassword -e MYSQL_DATABASE=gripinvest -e MYSQL_USER=gripinvest -e MYSQL_PASSWORD=gripinvest123 -p 3306:3306 -d mysql:8.0
   
   # Initialize database
   mysql -h localhost -u gripinvest -pgripinvest123 gripinvest < init_db/schemas.sql
   mysql -h localhost -u gripinvest -pgripinvest123 gripinvest < init_db/seed_data.sql
   ```

## 📊 Database Schema

The application uses the following main tables:

- **users**: User account information with risk appetite
- **investment_products**: Available investment products
- **investments**: User investments with expected returns
- **transaction_logs**: API call logging for monitoring

See `init_db/schemas.sql` for complete schema definition.

## 🧪 Testing

### Backend Tests
```bash
cd backend
npm test
npm run test:coverage
```

### Frontend Tests
```bash
cd frontend
npm test
npm run test:coverage
```

### Test Coverage
- Backend: ≥75% coverage achieved
- Frontend: ≥75% coverage achieved

## 📡 API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/password-reset` - Password reset (placeholder)

### Products
- `GET /api/products` - Get all products
- `POST /api/products` - Create product (admin)
- `PUT /api/products/:id` - Update product (admin)
- `DELETE /api/products/:id` - Delete product (admin)

### Investments
- `POST /api/investments` - Make investment
- `GET /api/investments/portfolio` - Get user portfolio

### Transactions
- `GET /api/transactions` - Get transaction logs

### Health
- `GET /health` - Health check endpoint

## 🤖 AI Integration

The platform includes several AI-powered features:

### Password Strength Analysis
- Real-time password strength feedback during signup
- Suggestions for improving password security

### Product Description Generation
- Automatic generation of product descriptions
- Context-aware descriptions based on product attributes

### Portfolio Insights
- Risk distribution analysis
- Diversification scoring
- Investment recommendations based on risk appetite

### Error Summarization
- AI-powered error analysis for transaction logs
- User-specific error pattern recognition

## 🐳 Docker Configuration

### Services
- **mysql**: MySQL 8.0 database with health checks
- **backend**: Node.js API server with health monitoring
- **frontend**: React app served by Nginx

### Health Checks
All services include health check endpoints:
- Database: MySQL ping check
- Backend: HTTP health endpoint
- Frontend: Nginx status check

## 📁 Project Structure

```
gripinvest_winter_internship_backend/
├── backend/
│   ├── src/
│   │   ├── controllers/     # API controllers
│   │   ├── middleware/      # Authentication middleware
│   │   ├── models/          # Database models
│   │   ├── routes/          # API routes
│   │   ├── services/        # Business logic services
│   │   ├── tests/           # Backend tests
│   │   └── utils/           # Utility functions
│   ├── Dockerfile
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── pages/           # Page components
│   │   ├── api/             # API client
│   │   └── tests/           # Frontend tests
│   ├── Dockerfile
│   └── package.json
├── init_db/
│   ├── schemas.sql          # Database schema
│   └── seed_data.sql        # Sample data
├── docker-compose.yml
└── README.md
```

## 🔧 Environment Variables

### Backend (.env)
```env
DB_HOST=localhost
DB_USER=gripinvest
DB_PASSWORD=gripinvest123
DB_DATABASE=gripinvest
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=24h
PORT=5000
NODE_ENV=development
```

## 🚀 Deployment

### Production Deployment
1. Update environment variables for production
2. Use production-grade JWT secrets
3. Configure proper database credentials
4. Set up SSL certificates
5. Use Docker Compose for orchestration

### Monitoring
- Health check endpoints for all services
- Transaction logging for API monitoring
- Error tracking and summarization

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure test coverage ≥75%
6. Submit a pull request

## 📝 License

This project is part of the Grip Invest Winter Internship 2025 program.

## 🎯 AI Usage Notes

### Development Acceleration
- **Code Generation**: AI was used to generate boilerplate code, API endpoints, and React components
- **Test Creation**: Comprehensive test suites were generated using AI to ensure ≥75% coverage
- **Documentation**: README and inline documentation were created with AI assistance

### Bug Fixing
- **Error Analysis**: AI helped identify and fix import issues, missing dependencies, and configuration problems
- **Code Review**: AI-assisted code review to ensure best practices and consistency
- **Dependency Management**: AI helped resolve package.json issues and dependency conflicts

### Feature Implementation
- **AI Service Integration**: Implemented AI service stubs for password strength, product descriptions, and portfolio insights
- **Database Schema**: AI-assisted in creating comprehensive database schemas with proper relationships
- **API Design**: RESTful API endpoints designed with AI guidance for consistency and best practices

### Quality Assurance
- **Test Coverage**: AI-generated tests ensure comprehensive coverage of all major functionality
- **Error Handling**: AI-assisted in implementing robust error handling throughout the application
- **Security**: AI guidance on implementing secure authentication and data validation

## 📞 Support

For questions or issues, please contact the development team or create an issue in the repository.

---

**Built with ❤️ for Grip Invest Winter Internship 2025**
