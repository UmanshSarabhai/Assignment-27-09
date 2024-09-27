const request = require("supertest");
const express = require("express");
const bodyParser = require("body-parser");

// Import the user controller (adjust the path as needed)
const userController = require("../controllers/user");

// Set up the express app
const app = express();
app.use(bodyParser.json());

// Routes as defined in your route configuration
app.post("/registerMember", userController.registerUser);
app.get("/getUserMembership", userController.getUserMembershipInfo);
app.get("/activeMemberships", userController.viewActiveMemberships);
app.patch("/cancelMembership", userController.terminateMembership);
app.patch("/modifyStartDate", userController.modifyMembershipStartDate);

// Test cases
describe("Membership Controller API Tests", () => {
  beforeEach(() => {
    // Reset the members array (if applicable)
    userController.members = []; // Assuming `members` is exported or resettable
  });

  test("Register a new user successfully", async () => {
    const response = await request(app).post("/registerMember").send({
      name: "test user",
      email: "test@example.com",
      startDate: "2024-09-01",
    });

    expect(response.statusCode).toBe(201);
    expect(response.body.message).toBe("Membership registered successfully!");
    expect(response.body.member).toHaveProperty("name", "test user");
    expect(response.body.member).toHaveProperty("email", "test@example.com");
  });

  test("Fail to register a user with missing email", async () => {
    const response = await request(app).post("/registerMember").send({
      name: "test user",
      startDate: "2024-09-01",
    });

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe(
      "Please provide name, email, and start date."
    );
  });

  test("Get user membership info successfully", async () => {
    // First, register a member
    await request(app).post("/registerMember").send({
      name: "newTest user",
      email: "newTest@example.com",
      startDate: "2024-09-01",
    });

    // Then, fetch the membership info
    const response = await request(app)
      .get("/getUserMembership")
      .query({ email: "newTest@example.com" });

    expect(response.statusCode).toBe(200);
    expect(response.body.member).toHaveProperty("name", "newTest user");
    expect(response.body.member).toHaveProperty("email", "newTest@example.com");
  });

  test("Fail to get non-existent user membership info", async () => {
    const response = await request(app)
      .get("/getUserMembership")
      .query({ email: "nonexistent@example.com" });

    expect(response.statusCode).toBe(404);
    expect(response.body.message).toBe("Member not found.");
  });

  test("Terminate a membership successfully", async () => {
    // First, register a member
    await request(app).post("/registerMember").send({
      name: "test user",
      email: "test@example.com",
      startDate: "2024-09-01",
    });

    // Then, terminate the membership
    const response = await request(app)
      .patch("/cancelMembership")
      .query({ email: "test@example.com" });

    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe("Membership canceled successfully!");
  });

  test("Fail to terminate non-existent membership", async () => {
    const response = await request(app)
      .patch("/cancelMembership")
      .query({ email: "nonexistent@example.com" });

    expect(response.statusCode).toBe(404);
    expect(response.body.message).toBe("Member not found.");
  });

  test("View all active memberships", async () => {
    // Register multiple members
    await request(app).post("/registerMember").send({
      name: "test user",
      email: "test@example.com",
      startDate: "2024-09-01",
    });

    await request(app).post("/registerMember").send({
      name: "newTest user",
      email: "newTest@example.com",
      startDate: "2024-09-02",
    });

    const response = await request(app).get("/activeMemberships");

    expect(response.statusCode).toBe(200);
  });
});
