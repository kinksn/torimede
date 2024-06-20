// src/__tests__/mocks/prismaMock.ts
import { PrismaClient } from "@prisma/client";
import { mockDeep, mockReset } from "jest-mock-extended";

const mockPrisma = mockDeep<PrismaClient>();

beforeEach(() => {
  mockReset(mockPrisma);
});

export { mockPrisma };

// 必要なモックテストを追加
test("mock test", () => {
  expect(true).toBe(true);
});
