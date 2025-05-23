"use client";

import { GetUserPostsOutput } from "@/app/api/post/model";
import { PostImage } from "@/components/PostImage";
// メインソンリーーレイアウト実現ライブラリ：https://github.com/sibiraj-s/react-layout-masonry#readme
// 本家だとSSR時にwindowオブジェクトがエラーになるバグがあったため直接プロジェクトに入れて読み込んでいる
import Masonry from "@/components/react-layout-masonry";
import { cn } from "@/lib/utils";

type PostCardProps = {
  userName: string;
  userPosts: GetUserPostsOutput;
  className?: string;
};

const UserPostCards = ({ userPosts, userName, className }: PostCardProps) => {
  return (
    <div className={cn("mb-10 max-sm:mb-5", className)}>
      <div className="bg-base-content px-5 py-10 max-sm:py-5 rounded-20">
        <h2 className="font-bold text-typography-lg leading-normal text-center font-zenMaruGothic">
          {userName}の投稿
        </h2>
        <Masonry
          columns={{ 845: 2, 1024: 3, 1280: 4 }}
          gap={20}
          className="max-w-[1600px] mx-auto mt-10 max-sm:mt-5 px-5 max-sm:px-0"
        >
          {userPosts.map((post) => (
            <PostImage post={post} key={post.id} />
          ))}
        </Masonry>
      </div>
    </div>
  );
};

export default UserPostCards;
