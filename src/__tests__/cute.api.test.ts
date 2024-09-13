import { db } from "@/lib/db";
import { POST } from "@/app/api/cute/[postId]/route";
import { createPOSTRequest } from "@/lib/test/testUtil";
import { Prisma } from "@prisma/client";
import { PostId } from "@/app/api/post/model";

// TODO: テストが通らないので修正する

// getAuthSessionのモック
jest.mock("../lib/auth", () => ({
  getAuthSession: jest.fn().mockResolvedValue({
    user: { id: "2", email: "user2@example.com" },
  }),
}));

const mockPost = {
  id: "1",
  title: "Post Title",
  content: "Post content",
  createdAt: new Date(),
  updatedAt: new Date(),
  tagId: "1",
  userId: "1",
  tag: {
    id: "1",
    name: "Tag1",
  },
};

describe("正常系", () => {
  it("かわいいを新規作成できること（POST）", async () => {
    const body = { userId: mockPost.userId, cuteCount: 10 };

    const req = createPOSTRequest(body, `/cute/${mockPost.id}`);
    const context = { params: { postId: mockPost.userId as PostId } };

    db.cute.create.mockImplementation((args: Prisma.CuteCreateArgs) => {
      return Promise.resolve({
        ...args.data,
      });
    });

    const res = await POST(req, context);
    const cute = await res.json();

    expect(res.status).toBe(200);
    expect(cute).toEqual(expect.objectContaining({ postId: mockPost.id }));
  });
});

describe("異常系", () => {
  it("ログインユーザーと投稿の作成者が同じ場合、かわいいを新規作成できないこと（POST）", async () => {
    const body = { userId: "2", cuteCount: 10 };

    const req = createPOSTRequest(body, `/cute/${mockPost.id}`);
    const context = { params: { postId: mockPost.userId as PostId } };

    db.cute.create.mockImplementation((args: Prisma.CuteCreateArgs) => {
      return Promise.resolve({
        ...args.data,
      });
    });

    const res = await POST(req, context);
    const cute = await res.json();

    expect(res.status).toBe(500);
    expect(cute).toEqual(
      expect.objectContaining({ message: "not arrow add cute" })
    );
  });
  it("ログインしていない場合、かわいいを新規作成できないこと（POST）", async () => {
    // セッション情報をnullにモック
    jest
      .mocked(require("../lib/auth").getAuthSession)
      .mockResolvedValueOnce(null);

    const body = { userId: mockPost.userId, cuteCount: 10 };

    const req = createPOSTRequest(body, `/cute/${mockPost.id}`);
    const context = { params: { postId: mockPost.userId as PostId } };

    db.cute.create.mockImplementation((args: Prisma.CuteCreateArgs) => {
      return Promise.resolve({
        ...args.data,
      });
    });

    const res = await POST(req, context);
    const cute = await res.json();

    expect(res.status).toBe(500);
    expect(cute).toEqual(
      expect.objectContaining({ message: "not arrow add cute" })
    );
  });
});
