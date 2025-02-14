# User Management API

A simple RESTful API for managing users with basic CRUD operations and JWT-based authentication. This project is built using Express, and MongoDB.


## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/en/download/)
- [MongoDB](https://docs.mongodb.com/manual/installation/) or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)

### Installation

1. **Clone the Repository**

   ```bash
   git clone https://github.com/yourusername/user-management-api.git
   cd user-management-api
   ```

2. **Install Dependencies**

   ```bash
   npm install
   ```
3. **Create a .env file**

   ```bash
   PORT = 3000
   MONGO_URI = your uri
   MONGO_URI_TEST = uri for running the test cases
   JWT_SECRET= your_secret_key
   ```
4. **Start the server**

   ```bash
   npm start
   ```
5. **Run the Testcases**

   ```bash
   npm test
   ```
   Expected Response after running the command:
   ```bash
   > user_management@1.0.0 test
   > jest

   PASS  test/api.test.js
     Auth Endpoints
        √ Signup: should register a new user (538 ms)
        √ Login: should authenticate a regular user and return a token (291 ms)
        √ Login: should authenticate an admin user and return a token (353 ms)
     User Endpoints (Protected)
        √ GET /api/users: should fail without token (5 ms)
        √ GET /api/users: should retrieve all users when authorized (65 ms)
        √ POST /api/users: should create a new user (53 ms)
        √ GET /api/users/:id: should retrieve a single user by ID (54 ms)
        √ PUT /api/users/:id: should update a user (57 ms)
        √ DELETE /api/users/:id: should fail for non-admin users (5 ms)
        √ DELETE /api/users/:id: should allow admin to delete a user (54 ms)
   
    Test Suites: 1 passed, 1 total
    Tests:       10 passed, 10 total
    Snapshots:   0 total
    Time:        3.637 s, estimated 4 s
    Ran all test suites.
   ```
## API Endpoints

###Authentication

1. **POST /api/auth/signup**

     Description: Register a new user.

  ```json
  {
     "name": "John Doe",
     "email": "john@example.com",
     "password": "password123"
  }
  ```
2. **POST /api/auth/login**

     Description: Login an existing user.
  ```json
  {
     "name": "John Doe",
     "email": "john@example.com",
     "password": "password123"
  }
  ```
Response:
  ```json
  {
     "token": "your_jwt_token_here"
  }
  ```
###User Management (Protected Routes - JWT Required)
1. **GET /api/users**
     Description: Get a list of all users.

2. **GET /api/users/:id**
     Description: Get a single user by ID.

3. **POST /api/users**
     Description: Create a new user.

  ```json
  {
     "name": "Jane Doe",
     "email": "jane@example.com",
     "role": "user"  // can be "user" or "admin"
  }
  ```
4. **PUT /api/users/:id**

     Description: Update an existing user by ID.
     Body: (Pass any fields that need updating)

5. **DELETE /api/users/:id**
     Description: Delete a user by ID (Admins only).

   
