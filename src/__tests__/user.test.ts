import { mockPrisma } from "./mocks/prismaMock";
import { POST } from "../app/api/user/route";
import bcrypt from "bcrypt";
import { PrismaClient, Prisma } from "@prisma/client";

jest.mock("bcrypt", () => ({
  hash: jest.fn((password, saltRounds) =>
    Promise.resolve(`hashed_${password}`)
  ),
}));

describe("User API", () => {
  test("should create a new user successfully", async () => {
    const body = {
      name: "John Doe",
      email: "john.doe@example.com",
      password: "password123",
    };

    const req = new Request("http://localhost:3000/api/user", {
      method: "POST",
      body: JSON.stringify(body),
    });

    const today = new Date();

    const hashedPassword = `hashed_${body.password}`;
    const user = {
      id: "1",
      name: body.name,
      email: body.email,
      emailVerified: null,
      image: null,
      createdAt: today,
      updatedAt: today,
      password: hashedPassword,
      isAdmin: false,
    };

    mockPrisma.user.create.mockImplementation((args) => {
      return Promise.resolve({
        ...args.data,
        id: "1",
        createdAt: today,
        updatedAt: today,
        emailVerified: null,
        image: null,
        isAdmin: false,
      }) as unknown as Prisma.Prisma__UserClient<typeof user>;
    });

    const res = await POST(req);
    const json = await res.json();

    console.log("Response status:", res.status);
    console.log("Response json:", json);

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
