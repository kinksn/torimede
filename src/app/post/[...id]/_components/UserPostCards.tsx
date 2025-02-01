"use client";

import { Session } from "next-auth";
import { GetUserPostsOutput } from "@/app/api/post/model";
import PostCard from "@/components/PostCard";
// メインソンリーーレイアウト実現ライブラリ：https://github.com/sibiraj-s/react-layout-masonry#readme
// 本家だとSSR時にwindowオブジェクトがエラーになるバグがあったため直接プロジェクトに入れて読み込んでいる
import Masonry from "@/components/react-layout-masonry";

type PostCardProps = {
  userName: string;
  userPosts: GetUserPostsOutput;
  session: Session | null;
};

const UserPostCards = ({ userPosts, userName, session }: PostCardProps) => {
  return (
    <div className="px-10 max-sm:px-0 mb-10 max-sm:mb-5">
      <div className="bg-base-content p-10 rounded-20 max-sm:p-5">
        <h2 className="font-bold text-typography-lg leading-normal text-center font-zenMaruGothic">
          {userName}の投稿
        </h2>
        <Masonry
          columns={{ 845: 2, 1024: 3, 1280: 4 }}
          gap={20}
          className="max-w-[1600px] mx-auto mt-10 max-sm:mt-5 px-5 max-sm:px-0"
        >
          {userPosts.map((post) => (
            <PostCard post={post} key={post.id} session={session} />
          ))}
        </Masonry>
      </div>
    </div>
  );
};

export default UserPostCards;
