import { db } from "@/lib/db";
import { GET as GET_ALL_POST } from "@/app/api/posts/route";
import { DELETE, PATCH, GET } from "@/app/api/posts/[postId]/route";
import { POST } from "@/app/api/posts/create/route";
import {
  createDELETERequest,
  createPATCHRequest,
  createPOSTRequest,
} from "@/lib/test/testUtil";
import { Prisma } from "@prisma/client";

// getAuthSessionのモック
jest.mock("../lib/auth", () => ({
  getAuthSession: jest.fn().mockResolvedValue({
    user: { id: "1", email: "test@example.com" },
  }),
}));

const mockPost = {
  id: "1",
  title: "Post Title",
  content: "Post content",
  createdAt: new Date(),
  updatedAt: new Date(),
  tagId: "1",
  tag: {
    id: "1",
    name: "Tag1",
  },
};

describe("正常系", () => {
  it("投稿一覧が取得できること（GET_ALL_POST）", async () => {
    const mockPosts = [mockPost];

    db.post.findMany.mockResolvedValue(mockPosts);

    const res = await GET_ALL_POST();
    const posts = await res.json();

    expect(res.status).toBe(200);
    expect(posts).toEqual(
      mockPosts.map((post) => ({ ...post, tag: post.tag ?? undefined }))
    );
  });

  it("特定の投稿を取得できること（GET）", async () => {
    db.post.findFirst.mockResolvedValue(mockPost);

    const req = new Request(`${process.env.API_URL}/${mockPost.id}`);
    const context = { params: { postId: mockPost.id } };

    const res = await GET(req, context);
    const post = await res.json();

    expect(res.status).toBe(200);
    expect(post).toEqual(mockPost);
  });

  it("投稿を新規作成できること（POST）", async () => {
    const body = {
      title: "New Post",
      content: "New content",
    };

    const req = createPOSTRequest(body, "/posts/create");

    db.post.create.mockImplementation((args: Prisma.PostCreateArgs) => {
      return Promise.resolve({
        ...args.data,
        id: "2",
        // `getAuthSession`でセッション情報からログインユーザーのuserIdを取得
        userId: "1",
      });
    });

    const res = await POST(req);
    const posts = await res.json();

    expect(res.status).toBe(200);
    expect(posts).toEqual(expect.objectContaining({ ...body, userId: "1" }));
  });

  it("投稿を更新できること（PATCH）", async () => {
    const body = {
      title: "Updated Title",
      content: "Updated content",
      tagId: "1",
      // `getAuthSession`でセッション情報からログインユーザーのuserIdを取得
      userId: "1",
    };

    db.post.update.mockImplementation((args: Prisma.PostUpdateArgs) => {
      return Promise.resolve({
        ...args.data,
      });
    });

    const req = createPATCHRequest(body, `/posts/${mockPost.id}`);
    const context = { params: { postId: mockPost.id } };

    const res = await PATCH(req, context);
    const posts = await res.json();

    expect(res.status).toBe(200);
    expect(posts).toEqual({ message: "update success" });
  });

  it("投稿を削除できること（DELETE）", async () => {
    const body = { userId: "1" };

    db.post.delete.mockResolvedValue({});

    const req = createDELETERequest(`/posts/${mockPost.id}`, body);
    const context = { params: { postId: mockPost.id } };

    const res = await DELETE(req, context);

    expect(res.status).toBe(204);
  });
});
