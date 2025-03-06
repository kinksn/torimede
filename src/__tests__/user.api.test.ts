import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";
import { POST } from "@/app/api/user/route";
import { GET } from "@/app/api/user/[userId]/route";
import bcrypt from "bcrypt";
import { createGETRequest, createPOSTRequest } from "@/lib/test/testUtil";
import { UserId, getUserOutputSchema } from "@/app/api/user/model";
import { USER_NOTFOUND_MESSAGE } from "@/app/api/user/userDao";

// getAuthSessionのモック
jest.mock("../lib/auth", () => ({
  getAuthSession: jest.fn().mockResolvedValue({
    user: { id: "1", email: "test@example.com" },
  }),
}));

describe("正常系", () => {
  it("新規ユーザーが作成できること（POST）", async () => {
    const body = {
      name: "medechan",
      email: "medechan@example.com",
      password: "password1234",
    };

    // POST APIの引数に渡すためのRequestオブジェクトを生成
    const req = createPOSTRequest(body, "/user");

    // POST(req)実行後、APIの`db.user.create`の実行を補足してreturnの内容のPormiseオブジェクトを返却する
    db.user.create.mockImplementation((args: Prisma.UserCreateArgs) => {
      return Promise.resolve({
        ...args.data,
      });
    });

    const res = await POST(req);
    const user = await res.json();

    expect(res.status).toBe(200);
    expect(user).toEqual(
      expect.objectContaining({
        name: body.name,
        email: body.email,
      })
    );
  });

  it("ハッシュ化したパスワードがリクエスト元のbodyで設定したものと一致していること（POST）", async () => {
    const body = {
      name: "medechan",
      email: "medechan@example.com",
      password: "password1234",
    };

    const req = createPOSTRequest(body, "/user");

    db.user.create.mockImplementation((args: Prisma.UserCreateArgs) => {
      return Promise.resolve({
        ...args.data,
      });
    });

    const user = await (await POST(req)).json();

    const isMatch = await bcrypt.compare(body.password, user.password);
    expect(isMatch).toBe(true);
  });

  it("特定のユーザー情報が取得できること（GET）", async () => {
    const userId = "userId" as UserId;
    const mockUserProfile = {
      id: userId,
      name: "medechan",
      image: "http://example.com/avatar.jpg",
    };

    const mockUserPosts = [
      { id: "post-1", userId, image: "http://example.com/post1.jpg" },
      { id: "post-2", userId, image: "http://example.com/post2.jpg" },
    ];

    const mockMededPosts = [
      { id: "post-3", userId, image: "http://example.com/post3.jpg" },
    ];

    db.user.findUnique.mockResolvedValue(mockUserProfile);
    db.post.findMany.mockResolvedValue(mockUserPosts);
    db.mede.findMany.mockResolvedValue(
      mockMededPosts.map((post) => ({
        post,
      }))
    );

    const req = createGETRequest(`/user/${userId}`);
    const context = { params: { userId } };
    const res = await GET(req, context);
    const result = await res.json();

    const expectedResponse = getUserOutputSchema.parse({
      profile: mockUserProfile,
      posts: mockUserPosts,
      mededPosts: mockMededPosts,
    });

    expect(res.status).toBe(200);
    expect(result).toEqual(expectedResponse);
  });
});

describe("異常系", () => {
  it("バリデーションを満たさない場合エラーになること（POST）", async () => {
    const req = new Request("http://localhost:3000/api/user", {
      method: "POST",
      body: JSON.stringify({
        name: "",
        email: "invalid-email",
        password: "123",
      }),
    });

    const res = await POST(req);
    const user = await res.json();

    expect(res.status).toBe(400);
    expect(user.errors).toBeDefined();
  });

  it("ユーザー作成に失敗すると500サーバーエラーを返すこと（POST）", async () => {
    const req = new Request("http://localhost:3000/api/user", {
      method: "POST",
      body: JSON.stringify({
        name: "medechan",
        email: "medechan@example.com",
        password: "password123",
      }),
    });

    db.user.create.mockRejectedValue(new Error("Database error"));

    const res = await POST(req);
    const user = await res.json();

    expect(res.status).toBe(500);
    expect(user.message).toBe("could not create user");
  });

  it("存在しないユーザーIDの場合、404エラーを返すこと（GET）", async () => {
    const userId = "userId" as UserId;
    db.user.findFirst.mockResolvedValue(null); // 存在しないユーザー

    const req = createGETRequest(`/user/${userId}`);
    const context = { params: { userId } };
    const res = await GET(req, context);
    const result = await res.json();

    expect(res.status).toBe(404);
    expect(result.message).toContain(USER_NOTFOUND_MESSAGE);
  });
});
