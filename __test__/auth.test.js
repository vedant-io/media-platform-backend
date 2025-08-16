import request from "supertest";
import app from "../server.js";

describe("Authentication API", () => {
  it("should allow a new user to sign up successfully", async () => {
    const response = await request(app).post("/api/auth/signup").send({
      email: "testuser1@example.com",
      password: "password123",
    });

    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty("_id");
  });

  it("should prevent a user from signing up with an existing email", async () => {
    const response = await request(app).post("/api/auth/signup").send({
      email: "testuser1@example.com",
      password: "password123",
    });

    expect(response.statusCode).toBe(400);
  });

  it("should allow a registered user to log in", async () => {
    const response = await request(app).post("/api/auth/login").send({
      email: "testuser1@example.com",
      password: "password123",
    });

    expect(response.statusCode).toBe(200);
    expect(response.headers["set-cookie"]).toBeDefined();
  });

  it("should reject a login attempt with an incorrect password", async () => {
    const response = await request(app).post("/api/auth/login").send({
      email: "testuser1@example.com",
      password: "wrongpassword",
    });

    expect(response.statusCode).toBe(400);
  });
});
