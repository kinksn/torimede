import { GetUserOutput, UserId } from "@/app/api/user/model";

type GetUserOptions = {
  posts?: boolean;
  mededPosts?: boolean;
};

export const getUser = async (userId: UserId, options?: GetUserOptions) => {
  const queryParams = new URLSearchParams();
  if (options?.posts) {
    queryParams.set("posts", "true");
  }
  if (options?.mededPosts) {
    queryParams.set("mededPosts", "true");
  }

  const url = `${process.env.NEXT_PUBLIC_API_URL}/user/${userId}${
    queryParams.toString() ? `?${queryParams.toString()}` : ""
  }`;

  try {
    const userData: GetUserOutput =
      await // 本番環境だと名前を変更してもすぐに反映しなかったので `{chache: "no-store"}` を設定したら変更が反映されるようになった
      (
        await fetch(url, {
          cache: "no-store",
        })
      ).json();
    return userData;
  } catch (error) {
    console.error(
      "An error occurred while retrieving user information:",
      error
    );
    throw error;
  }
};
