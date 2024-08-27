import { db } from "@/lib/db";
import { GET, POST } from "@/app/api/tag/route";
import { DELETE } from "@/app/api/tag/[tagId]/route";
import { createDELETERequest, createPOSTRequest } from "@/lib/test/testUtil";
import { Prisma } from "@prisma/client";

describe("正常系", () => {
  it("タグ一覧が取得できること（GET）", async () => {
    const mockTags = [
      { id: 1, name: "tag1", post: [] },
      { id: 2, name: "tag2", post: [] },
    ];

    db.tag.findMany.mockResolvedValue(mockTags);

    const res = await GET();
    const tags = await res.json();

    expect(res.status).toBe(200);
    expect(tags).toEqual(mockTags);
  });

  it("タグを新規作成できること（POST）", async () => {
    const body = {
      name: "new-tag1",
    };

    const req = createPOSTRequest(body, "/tags");

    db.tag.create.mockImplementation((args: Prisma.TagCreateArgs) => {
      return Promise.resolve({
        ...args.data,
      });
    });

    const res = await POST(req);
    const tag = await res.json();

    expect(res.status).toBe(200);
    expect(tag).toEqual(
      expect.objectContaining({
        name: body.name,
      })
    );
  });

  it("タグを削除できること（DELETE）", async () => {
    const mockTagId = "1";

    db.tag.delete = jest.fn().mockResolvedValue({});

    const req = createDELETERequest(`/tags/${mockTagId}`);

    const context = { params: { tagId: mockTagId } };

    const res = await DELETE(req, context);

    expect(res.status).toBe(204);
  });
});
