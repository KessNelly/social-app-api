const request = require("supertest");
const app = require("../src/server");

let token = "";
let postId = "";
let testEmail = `testuser_${Date.now()}@example.com`;

describe("Social Media API - Full Flow", () => {
  beforeAll(async () => {
    console.log("Starting Social Media API Tests...");

    //SIGNUP
    const signupRes = await request(app)
      .post("/api/auth/signup")
      .send({
        first_name: "Test",
        last_name: "User",
        username: `testuser_${Date.now()}`,
        email: testEmail,
        password: "password123",
      });

    console.log("Signup Status:", signupRes.statusCode);

    // LOGIN
    const loginRes = await request(app).post("/api/auth/login").send({
      email: testEmail,
      password: "password123",
    });

    if (loginRes.body.token) {
      token = loginRes.body.token;
      console.log("Login Successful - Token received");
    } else {
      console.log("Login Failed:", loginRes.body);
    }
  }, 25000);

  it("Should create a post (draft)", async () => {
    const res = await request(app)
      .post("/api/posts")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "My First Test Post",
        content: "This is a test post created during automated testing",
        tags: ["jest", "nodejs", "social"],
      });

    expect(res.statusCode).toBe(201);
    postId = res.body.post?._id;
    console.log("Post created successfully");
  });

  it("Should get my posts", async () => {
    const res = await request(app)
      .get("/api/posts/me")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
  });

  it("Should publish a post", async () => {
    const res = await request(app)
      .patch(`/api/posts/${postId}/publish`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
  });

  it("Should get published posts (Public - No Auth)", async () => {
    const res = await request(app).get("/api/posts/published");
    expect(res.statusCode).toBe(200);
  });

  it("Should get user feed", async () => {
    const res = await request(app)
      .get("/api/posts/feed")
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
  });

  it("Should toggle like on post", async () => {
    const res = await request(app)
      .post(`/api/likes/${postId}/toggle`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
  });
});
