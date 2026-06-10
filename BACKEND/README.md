# Notes Flow Backend API

A production-ready Node.js backend API for the Notes Flow application, built with Express.js and MongoDB.

## 🚀 Features

- **Secure Authentication**: JWT-based authentication with bcrypt password hashing
- **Rate Limiting**: Built-in rate limiting to prevent abuse
- **Security Headers**: Helmet.js for HTTP security headers
- **API Logging**: Pino logger with HTTP request tracking
- **API Documentation**: Swagger/OpenAPI documentation
- **Input Validation**: Express-validator for request validation
- **CORS Support**: Cross-Origin Resource Sharing enabled
- **OAuth Integration**: Google authentication support
- **Database**: MongoDB with Mongoose ODM

## 📋 Tech Stack

| Category          | Technology                |
| ----------------- | ------------------------- |
| Runtime           | Node.js (ES Modules)      |
| Framework         | Express.js v5.2.1         |
| Database          | MongoDB + Mongoose v9.6.2 |
| Authentication    | JWT + bcrypt v6.0.0       |
| Logging           | Pino v10.3.1 + Pino HTTP  |
| Security          | Helmet v8.2.0             |
| Rate Limiting     | Express Rate Limit v8.5.2 |
| API Documentation | Swagger JSDoc v6.3.0      |
| Validation        | Express Validator v7.3.2  |
| Dev Tools         | Nodemon v3.1.14           |

## 📦 Installation

### Prerequisites

- Node.js 18+
- MongoDB (local or cloud)
- npm or yarn

### Setup Steps

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd NOTES-FLOW/BACKEND
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment variables**

   ```bash
   cp .env.example .env
   ```

   Update `.env` with your configuration:

   ```env
   PORT=8000
   MONGODB_URI=mongodb://localhost:27017/notesflow
   JWT_SECRET=your_jwt_secret_key
   JWT_EXPIRY=7d
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   NODE_ENV=production
   LOG_LEVEL=info
   RATE_LIMIT_WINDOW=15
   RATE_LIMIT_MAX=100
   ```

## 🏃 Running the Server

### Development

```bash
npm run dev
```

Starts the server with Nodemon for auto-reload on file changes.

### Production

```bash
npm start
```

Starts the server in production mode.

## 📁 Project Structure

```
BACKEND/
├── src/
│   ├── config/          # Configuration files
│   ├── db/              # Database connection
│   ├── middleware/      # Custom middleware
│   ├── models/          # Mongoose models
│   ├── modules/         # Feature modules
│   ├── public/          # Static files
│   ├── utils/           # Utility functions
│   └── validators/      # Request validators
├── app.js              # Express app setup
├── index.js            # Server entry point
├── package.json        # Dependencies
└── .env.example        # Environment template
```

## 🔒 Security Features

### Helmet.js

Automatically sets HTTP security headers:

- Content Security Policy (CSP)
- X-Frame-Options
- X-Content-Type-Options
- Strict-Transport-Security
- And more...

### Rate Limiting

Configured to prevent DDoS and brute-force attacks:

- Window: 15 minutes (configurable)
- Max requests: 100 per window (configurable)

### Input Validation

All incoming requests are validated using Express Validator middleware.

### Password Security

Bcrypt for secure password hashing with salt rounds.

## 📊 Logging

The API uses Pino for structured logging:

```javascript
// Example log output
{
  "level": 30,
  "time": "2024-01-15T10:30:00.000Z",
  "req": {
    "method": "POST",
    "url": "/api/users",
    "headers": {...}
  },
  "res": {
    "statusCode": 201
  },
  "responseTime": 145
}
```

Configure log level in `.env`:

- `trace` - Most verbose
- `debug`
- `info` - Recommended for production
- `warn`
- `error` - Critical only
- `fatal` - System unusable

## 📖 API Documentation

Swagger API documentation is available at:

```
http://localhost:8000/api-docs
```

All endpoints are documented with:

- Request/response schemas
- Authentication requirements
- Error responses
- Example payloads

## 🔐 Authentication

### JWT Authentication

Protected routes require a Bearer token in the Authorization header:

```
Authorization: Bearer <jwt_token>
```

### Google OAuth

Google authentication is integrated for third-party login.

## 🌐 CORS Configuration

CORS is enabled for frontend integration. Configure allowed origins in middleware settings.

## 📝 Environment Variables

| Variable            | Description                          | Default     |
| ------------------- | ------------------------------------ | ----------- |
| `PORT`              | Server port                          | 8000        |
| `MONGODB_URI`       | MongoDB connection string            | -           |
| `JWT_SECRET`        | JWT signing secret                   | -           |
| `JWT_EXPIRY`        | JWT expiration time                  | 7d          |
| `NODE_ENV`          | Environment (development/production) | development |
| `LOG_LEVEL`         | Pino log level                       | info        |
| `RATE_LIMIT_WINDOW` | Rate limit window in minutes         | 15          |
| `RATE_LIMIT_MAX`    | Max requests per window              | 100         |

## 🚀 Production Deployment

### Pre-deployment Checklist

- [ ] All environment variables set correctly
- [ ] MongoDB connection verified
- [ ] JWT secret is strong and secure
- [ ] Rate limiting configured appropriately
- [ ] CORS origins whitelisted
- [ ] HTTPS enabled
- [ ] Logging level set to `info` or higher

### Recommended Setup

- Use a process manager like PM2 or Docker
- Enable reverse proxy (Nginx)
- Use helmet for security headers (already configured)
- Set up monitoring and alerting
- Implement backup strategy for MongoDB

### Docker Deployment

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 8000
CMD ["npm", "start"]
```

## 🧪 Testing

To add tests:

```bash
npm install --save-dev jest supertest
npm test
```

## 📦 Dependencies Overview

### Core

- **express**: Web framework
- **mongoose**: MongoDB ODM

### Security

- **bcrypt**: Password hashing
- **jsonwebtoken**: JWT handling
- **helmet**: Security headers
- **express-rate-limit**: Rate limiting

### Validation & Middleware

- **express-validator**: Input validation
- **cookie-parser**: Cookie parsing
- **cors**: Cross-origin support

### Logging & Monitoring

- **pino**: Structured logging
- **pino-http**: HTTP request logging

### API Documentation

- **swagger-jsdoc**: Swagger definition generator
- **swagger-ui-express**: Swagger UI

### OAuth

- **google-auth-library**: Google authentication

### Development

- **nodemon**: Auto-reload development server
- **pino-pretty**: Pretty-printed logs (dev only)

## 🐛 Troubleshooting

### MongoDB Connection Issues

```bash
# Verify MongoDB is running
# Check MONGODB_URI in .env
# Ensure network access is allowed
```

### JWT Token Errors

- Verify `JWT_SECRET` is set
- Check token expiration time
- Ensure token is sent in Authorization header

### Rate Limiting Blocks Requests

- Check `RATE_LIMIT_MAX` setting
- Verify `RATE_LIMIT_WINDOW` value
- Consider whitelist for internal IPs

## 📞 Support

For issues and questions, please create an issue in the repository.

## 📄 License

ISC

## 👨‍💻 Author

Notes Flow Development Team

---

**Last Updated**: January 2024  
**Version**: 1.0.0
