import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  // ユーザーの作成
  const userHashedPassword = await bcrypt.hash("password", 10);
  const user1 = await prisma.user.create({
    data: {
      name: "user1",
      email: "user1@example.com",
      password: userHashedPassword,
      isAdmin: true,
      isFirstLogin: false,
      image: `${process.env.NEXT_PUBLIC_ASSET_BASE_URL}/image/profileIcon/icon01.png`,
      oAuthProfileImage:
        "https://lh3.googleusercontent.com/ogw/AF2bZygRMZdGwvFrDJwj1e1qDMV3o8nmezoee7bWeiAcuBkRqf4=s32-c-mo",
    },
  });
  const user2 = await prisma.user.create({
    data: {
      name: "user2",
      email: "user2@example.com",
      password: userHashedPassword,
      isAdmin: true,
      isFirstLogin: false,
      image: `${process.env.NEXT_PUBLIC_ASSET_BASE_URL}/image/profileIcon/icon02.png`,
    },
  });

  // ポストの作成（ユーザーに関連付け）
  const posts = await Promise.all([
    prisma.post.create({
      data: {
        title: "スズメ",
        content: "チュンです",
        // ToDo：ビルド時には`/seed/`配下の画像はコンパイルに含めないようにしたい
        image: `${process.env.NEXT_PUBLIC_ASSET_BASE_URL}/seed/image/post/suzume.jpg`,
        userId: user1.id,
      },
    }),
    prisma.post.create({
      data: {
        title: "アキクサインコ",
        content: "色が桃みたいで可愛い",
        image: `${process.env.NEXT_PUBLIC_ASSET_BASE_URL}/seed/image/post/akikusa.jpg`,
        userId: user1.id,
      },
    }),
    prisma.post.create({
      data: {
        title: "コアジサシ",
        content: "親子かわいい",
        image: `${process.env.NEXT_PUBLIC_ASSET_BASE_URL}/seed/image/post/koajisashi.jpg`,
        userId: user1.id,
      },
    }),
    prisma.post.create({
      data: {
        title: "ピグミーファルコン",
        content: "猛禽類なのにかわいい",
        image: `${process.env.NEXT_PUBLIC_ASSET_BASE_URL}/seed/image/post/pygmy.jpg`,
        userId: user2.id,
      },
    }),
    prisma.post.create({
      data: {
        title: "ワライカワセミ",
        content: "もふもふふわふわ",
        image: `${process.env.NEXT_PUBLIC_ASSET_BASE_URL}/seed/image/post/waraikawaemi.jpg`,
        userId: user2.id,
      },
    }),
    prisma.post.create({
      data: {
        title: "コザクラインコ",
        content: "見た目が超キュート",
        image: `${process.env.NEXT_PUBLIC_ASSET_BASE_URL}/seed/image/post/kozakura.jpg`,
        userId: user2.id,
      },
    }),
    // 他のポストも同様に作成
  ]);

  // タグの作成
  const tag1 = await prisma.tag.create({
    data: {
      name: "もふもふ",
      userId: user1.id,
    },
  });

  const tag2 = await prisma.tag.create({
    data: {
      name: "ふわふわ",
      userId: user2.id,
    },
  });

  // ポストとタグの関連付け（PostTag）
  await prisma.postTag.createMany({
    data: posts
      .map((post) => [
        {
          postId: post.id,
          tagId: tag1.id,
        },
        {
          postId: post.id,
          tagId: tag2.id,
        },
      ])
      .flat(),
  });

  // Account（外部認証情報）の作成
  await prisma.account.createMany({
    data: [
      {
        userId: user1.id,
        type: "oauth",
        provider: "google",
        providerAccountId: "google-user1",
        access_token: "access-token-user1",
        refresh_token: "refresh-token-user1",
        expires_at: Math.floor(Date.now() / 1000) + 3600, // 1時間後に有効期限が切れるトークン
      },
      {
        userId: user2.id,
        type: "oauth",
        provider: "google",
        providerAccountId: "google-user2",
        access_token: "access-token-user2",
        refresh_token: "refresh-token-user2",
        expires_at: Math.floor(Date.now() / 1000) + 3600, // 1時間後に有効期限が切れるトークン
      },
    ],
  });

  // Session（セッション）の作成
  await prisma.session.createMany({
    data: [
      {
        userId: user1.id,
        sessionToken: "session-token-user1",
        accessToken: "access-token-user1",
        expires: new Date(Date.now() + 3600 * 1000), // 1時間後に有効期限が切れるセッション
      },
      {
        userId: user2.id,
        sessionToken: "session-token-user2",
        accessToken: "access-token-user2",
        expires: new Date(Date.now() + 3600 * 1000), // 1時間後に有効期限が切れるセッション
      },
    ],
  });

  // VerificationRequest（認証リクエスト）の作成
  await prisma.verificationRequest.create({
    data: {
      identifier: "testuser@example.com",
      token: "verification-token-example",
      expires: new Date(Date.now() + 24 * 3600 * 1000), // 24時間後に有効期限が切れるトークン
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
