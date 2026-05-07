const request = require("supertest");
const app = require("../src/server");

describe("Authentication API", () => {
  let testEmail = "";

  it("Should signup a new user", async () => {
    testEmail = `auth_${Date.now()}@example.com`;

    const res = await request(app)
      .post("/api/auth/signup")
      .send({
        first_name: "Auth",
        last_name: "Tester",
        username: `authtest_${Date.now()}`,
        email: testEmail,
        password: "password123",
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.token).toBeDefined();
  });

  it("Should login user", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: testEmail,
      password: "password123",
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();
    expect(res.body.success).toBe(true);
  });
});
