# Document Management System - Backend

Backend API for the Document Management System built with Node.js, Express, TypeScript, and Prisma.

## Features

- User authentication (register/login) with JWT
- Document CRUD operations
- File upload with Multer
- Document filtering by tags
- Pagination support
- RESTful API

## Tech Stack

- Node.js + Express
- TypeScript
- Prisma ORM
- MySQL
- JWT for authentication
- Bcrypt for password hashing
- Multer for file uploads

## Setup

1. Install dependencies:
```bash
npm install
```

2. Make sure MySQL is running (via Docker):
```bash
docker-compose up -d
```

3. Run Prisma migrations:
```bash
npx prisma migrate dev
```

4. Generate Prisma Client:
```bash
npx prisma generate
```

5. Start the development server:
```bash
npm run dev
```

The server will start on `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user

### Documents (Protected)
- `GET /api/documents` - Get all documents (with pagination and filtering)
- `POST /api/documents` - Create new document (with file upload)
- `PUT /api/documents/:id` - Update document
- `DELETE /api/documents/:id` - Delete document
- `GET /api/documents/:id/download` - Download document
- `GET /api/documents/tags/list` - Get all unique tags

### Health Check
- `GET /api/health` - Check server status

## Environment Variables

See `.env` file for configuration options.

## Scripts

- `npm run dev` - Start development server with nodemon
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server
