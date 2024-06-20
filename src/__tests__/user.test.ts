import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";
import { POST } from "../app/api/user/route";
import bcrypt from "bcrypt";

const postRequestUser = (
  body?: { name: string; email: string; password: string },
  apiUrl?: string
) => {
  return new Request((apiUrl = `${process.env.API_URL}/user`), {
    method: "POST",
    body: JSON.stringify(
      (body = {
        name: "John Doe",
        email: "john.doe@example.com",
        password: "password1234",
      })
    ),
  });
};

describe("User API", () => {
  it("新規ユーザーが作成できること", async () => {
    const body = {
      name: "John Doe",
      email: "john.doe@example.com",
      password: "password1234",
    };

    // POST APIの引数に渡すためのRequestオブジェクトを生成
    const req = postRequestUser(body);

    // POST(req)実行後、APIの`db.user.create`の実行を補足してreturnの内容のPormiseオブジェクトを返却する
    db.user.create.mockImplementation((args: Prisma.UserCreateArgs) => {
      return Promise.resolve({
        ...args.data,
      });
    });

    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json).toEqual(
      expect.objectContaining({
        name: body.name,
        email: body.email,
      })
    );
  });

  it("ハッシュ化したパスワードが元と一致していること", async () => {
    const body = {
      name: "John Doe",
      email: "john.doe@example.com",
      password: "password1234",
    };

    const req = postRequestUser(body);

    db.user.create.mockImplementation((args: Prisma.UserCreateArgs) => {
      return Promise.resolve({
        ...args.data,
      });
    });

    const res = await POST(req);
    const json = await res.json();

    const isMatch = await bcrypt.compare(body.password, json.password);
    expect(isMatch).toBe(true);
  });

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
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.errors).toBeDefined();
  });

  it("ユーザー作成に失敗すると500サーバーエラーを返すこと", async () => {
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
    const json = await res.json();

    expect(res.status).toBe(500);
    expect(json.message).toBe("could not create user");
  });
});
