import { PrismaClient } from "@prisma/client";
import { mockDeep, mockReset } from "jest-mock-extended";

// Prismaのモックを本物のPrimsaのように、
// mockPrisma.user.create... のような形でアクセス可能にするための処理
// mockDeepの型引数に渡すことで完全にすべてのメソッドを使えるようにしている
const mockPrisma = mockDeep<PrismaClient>();

// beforeEach フックは、各テストの前に実行される関数を定義している
// この場合、mockReset(mockPrisma) を使用して、mockPrisma の状態をリセットする
// これにより、各テストが独立して実行され、前のテストの影響を受けない
beforeEach(() => {
  mockReset(mockPrisma);
});

export { mockPrisma };
