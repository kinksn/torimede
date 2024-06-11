import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";
import { POST } from "@/app/api/user/route";
import bcrypt from "bcrypt";
import { createPOSTRequest } from "@/lib/test/testUtil";

describe("正常系", () => {
  it("新規ユーザーが作成できること（POST）", async () => {
    const body = {
      name: "John Doe",
      email: "john.doe@example.com",
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

  it("ハッシュ化したパスワードがリクエスト元のbodyで設定したものと一致していること", async () => {
    const body = {
      name: "John Doe",
      email: "john.doe@example.com",
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
});

describe("異常系", () => {
  it("バリデーションを満たさない場合エラーになること", async () => {
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
        name: "John Doe",
        email: "john.doe@example.com",
        password: "password123",
      }),
    });

    db.user.create.mockRejectedValue(new Error("Database error"));

    const res = await POST(req);
    const user = await res.json();

    expect(res.status).toBe(500);
    expect(user.message).toBe("could not create user");
  });
});
