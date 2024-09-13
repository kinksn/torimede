import { db } from "@/lib/db";
import { GET as GET_ALL_POST } from "@/app/api/post/route";
import { DELETE, PATCH, GET } from "@/app/api/post/[postId]/route";
import { POST } from "@/app/api/post/create/route";
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
  tags: [
    {
      id: "1",
      name: "Tag1",
    },
  ],
};

describe("正常系", () => {
  it("投稿一覧が取得できること（GET_ALL_POST）", async () => {
    const mockPosts = [
      {
        ...mockPost,
        tags: mockPost.tags.map((tag) => ({
          tag: {
            id: tag.id,
            name: tag.name,
          },
        })),
      },
    ];

    db.post.findMany.mockResolvedValue(mockPosts);

    const res = await GET_ALL_POST();
    const posts = await res.json();

    expect(res.status).toBe(200);
    expect(posts).toEqual(
      mockPosts.map((post) => ({
        ...post,
        tags: post.tags.map((tagRelation) => ({
          id: tagRelation.tag.id,
          name: tagRelation.tag.name,
        })),
      }))
    );
  });

  it("特定の投稿を取得できること（GET）", async () => {
    const mockPostWithTags = {
      ...mockPost,
      tags: mockPost.tags.map((tag) => ({
        tag: {
          id: tag.id,
          name: tag.name,
        },
      })),
    };

    db.post.findFirst.mockResolvedValue(mockPostWithTags);

    const req = new Request(`${process.env.API_URL}/${mockPost.id}`);
    const context = { params: { postId: mockPost.id } };

    const res = await GET(req, context);
    const post = await res.json();

    expect(res.status).toBe(200);
    expect(post).toEqual({
      ...mockPostWithTags,
      tags: mockPost.tags.map((tag) => ({
        id: tag.id,
        name: tag.name,
      })),
    });
  });

  it("投稿を新規作成できること（POST）", async () => {
    const body = {
      title: "New Post",
      content: "New content",
      image: "https://example.com/image/bird.jpg",
      tags: ["1"], // タグIDの配列を設定
    };

    db.post.create.mockImplementation((args: Prisma.PostCreateArgs) => {
      return Promise.resolve({
        ...args.data,
        id: "2",
        userId: "1", // セッションから取得
        tags: body.tags.map((tagId) => ({
          id: tagId,
          name: mockPost.tags[0].name,
        })),
      });
    });

    const req = createPOSTRequest(body, "/posts/create");
    const res = await POST(req);
    const post = await res.json();

    expect(res.status).toBe(200);
    expect(post).toEqual(
      expect.objectContaining({
        ...body,
        userId: "1",
        tags: body.tags.map((tagId) => ({
          id: tagId,
          name: "Tag1",
        })),
      })
    );
  });

  it("投稿を更新できること（PATCH）", async () => {
    const body = {
      title: "Updated Title",
      content: "Updated content",
      userId: "1", // セッションから取得
      tags: ["1"],
    };

    db.post.update.mockImplementation((args: Prisma.PostUpdateArgs) => {
      return Promise.resolve({
        ...args.data,
        tags: body.tags.map((tagId) => ({
          id: tagId,
          name: "Tag1", // テスト用のモックデータとして適切なタグ名を設定
        })),
      });
    });

    const req = createPATCHRequest(body, `/posts/${mockPost.id}`);
    const context = { params: { postId: mockPost.id } };

    const res = await PATCH(req, context);
    const post = await res.json();

    expect(res.status).toBe(200);
    expect(post).toEqual({ message: "update success" });
  });

  it("投稿を削除できること（DELETE）", async () => {
    // `getAuthSession`でセッション情報からログインユーザーのuserId
    const body = { userId: "1" };

    db.post.delete.mockResolvedValue({});

    const req = createDELETERequest(`/posts/${mockPost.id}`, body);
    const context = { params: { postId: mockPost.id } };

    const res = await DELETE(req, context);

    expect(res.status).toBe(204);
  });

  // it("ファイルをアップロードできること（UPLOAD）", async () => {
  //   const filePath = path.join(__dirname, "./assets/test.jpg");
  //   const fileBuffer = fs.readFileSync(filePath);
  //   const { url, options } = createFileUploadRequest(
  //     fileBuffer,
  //     "test.jpg",
  //     "image/jpg",
  //     "/posts/upload"
  //   );

  //   const res = await UPLOAD(new Request(url, options));
  //   const result = await res.json();

  //   expect(res.status).toBe(200);
  //   expect(result).toHaveProperty("fileUrl");
  // });
});
