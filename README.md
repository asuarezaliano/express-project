# Node.js Express API with Prisma

A RESTful API built with Node.js, Express, and Prisma ORM, featuring authentication, CRUD operations, and comprehensive error handling.

## 🌐 Backend URL

The API is currently running at:

```
https://express-project-ylkl.onrender.com

```

## 🚀 Features

- **Authentication & Authorization**

  - JWT-based authentication
  - Password hashing with bcrypt
  - Protected routes middleware

- **Database**

  - MySQL database
  - Prisma ORM for database operations
  - Structured schema with relations

- **API Features**

  - CRUD operations
  - Input validation using Express Validator
  - Error handling middleware
  - Request logging with Morgan

- **Testing**
  - Jest for unit testing
  - Supertest for API endpoint testing

## 📋 Prerequisites

- Node.js
- MySQL
- npm or yarn

## 🛠️ Installation

1. Clone the repository:

```bash
git clone https://github.com/asuarezaliano/express-project.git
```

2. Install dependencies:

```bash
npm install
or
yarn install
```

3. Create a `.env` file in the root directory:

```env
DATABASE_URL="database_url"
JWT_SECRET="your-secret-key"
```

4. Run Prisma migrations:

```

## 🏗️ Project Structure

```

src/
├── controllers/ # Route controllers
├── services/ # Business logic
├── middleware/ # Custom middleware
│ ├── error/ # Error handling
│ ├── auth/ # Authentication
│ └── validators/ # Input validation
├── routes/ # API routes
├── db/ # Database configuration
│ └── index.ts # Prisma client initialization
├── index.ts # Server configuration and middleware setup
│ ├── cors # CORS middleware
│ ├── morgan # HTTP request logging
│ ├── express # JSON and URL-encoded parsing
│ └── router # API routes mounting

## 📚 API Documentation

### Authentication Endpoints

```
POST /api/session/signin
```

### Product Endpoints

```
GET    /api/product
GET    /api/products/:id
POST   /api/product
PUT    /api/product/:id
DELETE /api/product/:id
```

### Update Endpoints

```
GET    /api/updates
POST   /api/updates
GET    /api/updates/:id
PUT    /api/updates/:id
DELETE /api/updates/:id
```

## 🔒 Authentication

The API uses JWT for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-token>
```

## 🧪 Testing

Run tests using:

```bash
npm test
```

## 🛡️ Error Handling

The API includes centralized error handling with custom error classes and middleware for:

- Validation errors
- Authentication errors
- Database errors
- Generic server errors

## 🔍 Validation

Input validation is implemented using Express Validator for all API endpoints to ensure data integrity and security.

## 📝 Database Schema

The database includes the following models:

- User
- Product
- Update
- UpdatePoint

Each model includes timestamps and proper relationships as defined in the Prisma schema.

## 🚀 Development

Start the development server:

```bash
npm run dev
```

The server uses Morgan for logging HTTP requests in development mode.

## 📄 License

[MIT](LICENSE)

```

This README provides a comprehensive overview of your project, including:
- Main features and technologies used
- Installation instructions
- Project structure
- API documentation
- Authentication details
- Testing information
- Error handling approach
- Database schema overview
- Development instructions

You can further customize it by:
1. Adding specific API endpoint documentation with request/response examples
2. Including more detailed testing instructions
3. Adding deployment instructions
4. Including contributing guidelines
5. Adding badges for build status, code coverage, etc.
```
