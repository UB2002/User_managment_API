// tests/api.test.js

// Ensure test environment is set before any imports
process.env.NODE_ENV = "test";
process.env.MONGO_URI = process.env.MONGO_URI_TEST;

const request = require("supertest");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const app = require("../server");
const User = require("../models/user");

let userToken;
let adminToken;
let testUserId;

beforeAll((done) => {
  if (mongoose.connection.readyState === 1) {
    return done();
  }
  mongoose.connection.once("open", done);
});

afterAll(async () => {
  if (mongoose.connection.readyState === 1) {
    await mongoose.connection.db.dropDatabase();
  }
  await mongoose.connection.close();
});

describe("Auth Endpoints", () => {
  test("Signup: should register a new user", async () => {
    const res = await request(app).post("/api/auth/signup").send({
      name: "New User",
      email: "newuser@example.com",
      password: "password123",
    });
    expect(res.statusCode).toEqual(201);
    expect(res.body.message).toBe("User registered successfully");
  });

  test("Login: should authenticate a regular user and return a token", async () => {
    // Ensure the user exists
    await request(app).post("/api/auth/signup").send({
      name: "Test User",
      email: "test@example.com",
      password: "password123",
    });

    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "test@example.com", password: "password123" });
    expect(res.statusCode).toEqual(200);
    expect(res.body.token).toBeDefined();
    userToken = res.body.token;
  });

  test("Login: should authenticate an admin user and return a token", async () => {
    // Create an admin user if not already present
    const existingAdmin = await User.findOne({ email: "admin@example.com" });
    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash("adminpass", 10);
      const adminUser = new User({
        name: "Admin User",
        email: "admin@example.com",
        password: hashedPassword,
        role: "admin",
      });
      await adminUser.save();
    }

    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "admin@example.com", password: "adminpass" });
    expect(res.statusCode).toEqual(200);
    expect(res.body.token).toBeDefined();
    adminToken = res.body.token;
  });
});

describe("User Endpoints (Protected)", () => {
  test("GET /api/users: should fail without token", async () => {
    const res = await request(app).get("/api/users");
    expect(res.statusCode).toEqual(401);
  });

  test("GET /api/users: should retrieve all users when authorized", async () => {
    const res = await request(app)
      .get("/api/users")
      .set("Authorization", `Bearer ${userToken}`);
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBeTruthy();
  });

  test("POST /api/users: should create a new user", async () => {
    const res = await request(app)
      .post("/api/users")
      .set("Authorization", `Bearer ${userToken}`)
      .send({
        name: "User Create",
        email: "usercreate@example.com",
        role: "user",
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body._id).toBeDefined();
    testUserId = res.body._id;
  });

  test("GET /api/users/:id: should retrieve a single user by ID", async () => {
    const res = await request(app)
      .get(`/api/users/${testUserId}`)
      .set("Authorization", `Bearer ${userToken}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body.email).toEqual("usercreate@example.com");
  });

  test("PUT /api/users/:id: should update a user", async () => {
    const res = await request(app)
      .put(`/api/users/${testUserId}`)
      .set("Authorization", `Bearer ${userToken}`)
      .send({ name: "Updated Name" });
    expect(res.statusCode).toEqual(200);
    expect(res.body.name).toEqual("Updated Name");
  });

  test("DELETE /api/users/:id: should fail for non-admin users", async () => {
    const res = await request(app)
      .delete(`/api/users/${testUserId}`)
      .set("Authorization", `Bearer ${userToken}`);
    expect(res.statusCode).toEqual(403);
    expect(res.body.message).toBe("Forbidden: Admins only");
  });

  test("DELETE /api/users/:id: should allow admin to delete a user", async () => {
    const res = await request(app)
      .delete(`/api/users/${testUserId}`)
      .set("Authorization", `Bearer ${adminToken}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body.message).toBe("User deleted");
  });
});
