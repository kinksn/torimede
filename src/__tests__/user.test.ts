import { mockPrisma } from "./mocks/prismaMock";
import { POST } from "../app/api/user/route";

describe("User API", () => {
  test("should create a new user successfully", async () => {
    const req = new Request("http://localhost:3000/api/user", {
      method: "POST",
      body: JSON.stringify({
        name: "John Doe",
        email: "john.doe@example.com",
        password: "password123",
      }),
    });

    const user = {
      id: "1",
      name: "John Doe",
      email: "john.doe@example.com",
      emailVerified: null,
      image: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      password: "hashedPassword",
      isAdmin: false,
    };

    mockPrisma.user.create.mockResolvedValue(user);

    const res = await POST(req);
    const json = await res.json();

    // console.log("Response status:", res.status);
    // console.log("Response json:", json);

    expect(res.status).toBe(200);
    expect(json).toEqual(user);
  });

  test("should return validation error", async () => {
    const req = new Request("http://localhost:3000/api/user", {
      method: "POST",
      body: JSON.stringify({
        name: "",
        email: "invalid-email",
        password: "123",
      }),
    });

    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.errors).toBeDefined();
  });

  test("should return server error on user creation failure", async () => {
    const req = new Request("http://localhost:3000/api/user", {
      method: "POST",
      body: JSON.stringify({
        name: "John Doe",
        email: "john.doe@example.com",
        password: "password123",
      }),
    });

    mockPrisma.user.create.mockRejectedValue(new Error("Database error"));

    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(500);
    expect(json.message).toBe("could not create user");
  });
});
