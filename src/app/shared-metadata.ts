export const COMMON_OG_IMAGE = {
  images: `${process.env.NEXT_PUBLIC_BASE_URL}/og/ogp-default.png`,
};

export const METADATA_TITLE = {
  top: "トリメデ",
  about: "トリメデとは",
  login: "ログイン",
  signup: "新規登録",
  search: "検索結果",
  term: "利用規約",
  policy: "プライバシーポリシー",
  post: {
    create: "新規投稿",
    edit: "投稿編集",
  },
  user: {
    edit: "プロフィール編集",
  },
};

export const DESCRIPTION = {
  common:
    "トリメデは鳥さんにまつわる全てのものを愛でる画像共有サービスです。くわしい人から普段なんとなく鳥さんが気になっている人まですべての鳥好きが楽しめる場所です。",
};

export const FAVICON = {
  icon: [
    {
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/favicon.svg`,
      type: "image/svg+xml",
    },
  ],
};
