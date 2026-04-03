# Zorvyn API

Zorvyn is a financial management backend API built with **Node.js**, **Express**, **Prisma ORM**, and **PostgreSQL**. It provides secure role-based access for managing and analyzing financial records.

## Project Setup

Follow these steps to set up the project locally:

### 1. Prerequisites

Make sure you have installed:
- [Node.js](https://nodejs.org/)
- [PostgreSQL](https://www.postgresql.org/)

### 2. Configure Environment Variables

Create a `.env` file in the root of your project or modify an existing one with the following variables:

```env
# Database connection string to your PostgreSQL database
DATABASE_URL="postgresql://user:password@localhost:5432/zorvyn_db?schema=public"

# Secret key for signing JWT tokens
JWT_SECRET="your_jwt_secret_here"

# Set the port (optional, defaults to 3000 if not set in server.js)
PORT=3000
```

### 3. Install Dependencies

Install project packages using npm:

```bash
npm install
```

### 4. Database Setup

Push the Prisma schema state to your database to create the required tables:

```bash
npm run db:push
```

*(Optional)* You can also generate the Prisma client if needed: `npx prisma generate`

### 5. Start the Server

Start the application in development mode (using Nodemon):

```bash
npm run dev
```

To run in production:

```bash
npm start
```

The server should now be running (by default on `http://localhost:3000` or the PORT provided in your `.env`).

---

## API Documentation

All routes (except `/` and `/api/auth/*`) require a valid JWT token in the `Authorization` header (`Bearer <token>`).

### Global Endpoints

#### Health Check
- **Endpoint:** `GET /`
- **Description:** Basic health check to ensure the API is running.
- **Response (200 OK):**
```json
{
  "message": "Zorvyn API is running successfully."
}
```

---

### Authentication (`/api/auth`)

#### 1. Register User
- **Endpoint:** `POST /api/auth/register`
- **Description:** Register a new user. Role defaults to `VIEWER` if not specified.
- **Request Body:**
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "password123",
  "role": "ADMIN" // Optional: 'ADMIN', 'ANALYST', or 'VIEWER'
}
```
- **Response (201 Created):**
```json
{
  "message": "User registered successfully",
  "userId": "uuid-string"
}
```

#### 2. Login User
- **Endpoint:** `POST /api/auth/login`
- **Description:** Authenticate a user and receive a JWT token.
- **Request Body:**
```json
{
  "email": "jane@example.com",
  "password": "password123"
}
```
- **Response (200 OK):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR...",
  "role": "ADMIN"
}
```

---

### Users (`/api/users`)
*Requires `ADMIN` role.*

#### 1. Get All Users
- **Endpoint:** `GET /api/users`
- **Description:** Retrieve a list of all registered users.
- **Headers:** `Authorization: Bearer <token>`
- **Response (200 OK):**
```json
[
  {
    "id": "uuid-string",
    "name": "Jane Doe",
    "email": "jane@example.com",
    "role": "ADMIN",
    "status": "ACTIVE",
    "createdAt": "2026-04-03T12:00:00.000Z"
  }
]
```

#### 2. Update User Role
- **Endpoint:** `PUT /api/users/:id/role`
- **Description:** Update a specific user's role.
- **Headers:** `Authorization: Bearer <token>`
- **Request Body:**
```json
{
  "role": "ANALYST" // 'ADMIN', 'ANALYST', or 'VIEWER'
}
```
- **Response (200 OK):**
```json
{
  "id": "uuid-string",
  "name": "Jane Doe",
  "role": "ANALYST"
}
```

#### 3. Update User Status
- **Endpoint:** `PUT /api/users/:id/status`
- **Description:** Update a user's account status.
- **Headers:** `Authorization: Bearer <token>`
- **Request Body:**
```json
{
  "status": "INACTIVE" // 'ACTIVE' or 'INACTIVE'
}
```
- **Response (200 OK):**
```json
{
  "id": "uuid-string",
  "name": "Jane Doe",
  "status": "INACTIVE"
}
```

---

### Financial Records (`/api/records`)

#### 1. Get Records
- **Endpoint:** `GET /api/records`
- **Description:** Retrieve a paginated list of financial records.
- **Headers:** `Authorization: Bearer <token>`
- **Required Roles:** `ADMIN`, `ANALYST`
- **Query Parameters (Optional):**
  - `type` (`INCOME` | `EXPENSE`)
  - `category` (string)
  - `startDate` (ISO datetime)
  - `endDate` (ISO datetime)
  - `search` (Search notes content)
  - `page` (default: 1)
  - `limit` (default: 10)
- **Response (200 OK):**
```json
{
  "data": [
    {
      "id": "uuid-string",
      "amount": 1500,
      "type": "INCOME",
      "category": "Salary",
      "date": "2026-04-01T00:00:00.000Z",
      "notes": "April Salary",
      "userId": "uuid-string",
      "isDeleted": false,
      "createdAt": "..."
    }
  ],
  "meta": {
    "total": 1,
    "page": 1,
    "limit": 10
  }
}
```

#### 2. Create Record
- **Endpoint:** `POST /api/records`
- **Description:** Add a new financial record.
- **Headers:** `Authorization: Bearer <token>`
- **Required Role:** `ADMIN`
- **Request Body:**
```json
{
  "amount": 150.50,
  "type": "EXPENSE", // 'INCOME' or 'EXPENSE'
  "category": "Groceries",
  "date": "2026-04-03T10:00:00.000Z",
  "notes": "Weekly groceries" // Optional
}
```
- **Response (201 Created):** Returns the created record object.

#### 3. Update Record
- **Endpoint:** `PUT /api/records/:id`
- **Description:** Update an existing financial record.
- **Headers:** `Authorization: Bearer <token>`
- **Required Role:** `ADMIN`
- **Request Body (All fields optional):**
```json
{
  "amount": 200,
  "type": "EXPENSE",
  "category": "Groceries",
  "date": "2026-04-03T10:00:00.000Z",
  "notes": "Updated note"
}
```
- **Response (200 OK):** Returns the updated record object.

#### 4. Delete Record (Soft Delete)
- **Endpoint:** `DELETE /api/records/:id`
- **Description:** Mark a record as deleted.
- **Headers:** `Authorization: Bearer <token>`
- **Required Role:** `ADMIN`
- **Response (200 OK):**
```json
{
  "message": "Record deleted successfully"
}
```

---

### Dashboard (`/api/dashboard`)

#### 1. Get Dashboard Summary
- **Endpoint:** `GET /api/dashboard/summary`
- **Description:** Retrieve aggregated data based on undeleted records.
- **Headers:** `Authorization: Bearer <token>`
- **Required Roles:** `ADMIN`, `ANALYST`, `VIEWER`
- **Response (200 OK):**
```json
{
  "totalIncome": 1500,
  "totalExpenses": 200,
  "netBalance": 1300,
  "categoryWise": [
    {
      "category": "Salary",
      "type": "INCOME",
      "total": 1500
    },
    {
      "category": "Groceries",
      "type": "EXPENSE",
      "total": 200
    }
  ],
  "recentActivity": [
    // Array of up to 5 most recently created records
  ]
}
```
