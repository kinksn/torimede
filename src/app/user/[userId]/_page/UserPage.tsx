"use client";

import ButtonAction from "@/components/ButtonAction";
import { GetUserOutput } from "@/app/api/user/model";
import { UserProfile } from "@/app/user/[userId]/_components/UserProfile";
import PostCard from "@/components/PostCard";
import { InitialPagePathSetter } from "@/components/InitialPagePathSetter";
import { Session } from "next-auth";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// メインソンリーーレイアウト実現ライブラリ：https://github.com/sibiraj-s/react-layout-masonry#readme
// 本家だとSSR時にwindowオブジェクトがエラーになるバグがあったため直接プロジェクトに入れて読み込んでいる
import Masonry from "@/components/react-layout-masonry";

type UserPageProps = {
  profile: GetUserOutput;
  session: Session | null;
};

export const UserPage = ({ profile, session }: UserPageProps) => {
  const { profile: userProfile, posts, cutedPosts } = profile;

  const isMe = session?.user?.id === userProfile.id;

  return (
    <>
      <InitialPagePathSetter />
      <div className="max-sm:mx-auto">
        <UserProfile userProfile={userProfile} readonly={!isMe} />
        <Tabs defaultValue="myPost" className="max-w-[1600px] mx-auto mt-10">
          <TabsList className="grid grid-cols-2 max-w-fit h-12 p-0 bg-transparent">
            <TabsTrigger
              value="myPost"
              className="relative px-4 py-0 h-11 flex justify-center before:content-[''] before:absolute before:opacity-0 before:block before:w-full before:rounded-full before:h-1 before:bg-primary-900 before:left-0 before:bottom-0 data-[state=active]:before:opacity-100 font-zenMaruGothic text-typography-sm !text-textColor-basic font-medium rounded-tr-md rounded-tl-md rounded-bl-none rounded-br-none data-[state=active]:bg-primary-50 !shadow-none "
            >
              投稿一覧
            </TabsTrigger>
            {isMe && (
              <TabsTrigger
                value="medeHistory"
                className="relative px-4 py-0 h-11 flex justify-center before:content-[''] before:absolute before:opacity-0 before:block before:w-full before:rounded-full before:h-1 before:bg-primary-900 before:left-0 before:bottom-0 data-[state=active]:before:opacity-100 font-zenMaruGothic text-typography-sm !text-textColor-basic font-medium rounded-tr-md rounded-tl-md rounded-bl-none rounded-br-none data-[state=active]:bg-primary-50 !shadow-none"
              >
                めで履歴
              </TabsTrigger>
            )}
          </TabsList>
          <TabsContent value="myPost">
            <Masonry columns={{ 845: 2, 1024: 3, 1280: 4 }} gap={20}>
              {posts.length > 0 ? (
                posts.map((post) => (
                  <PostCard
                    post={post}
                    key={post.id}
                    menu={
                      isMe && (
                        <ButtonAction
                          postId={post.id}
                          userId={post.userId}
                          redirectOnDelete={false}
                        />
                      )
                    }
                  />
                ))
              ) : (
                <div>まだ投稿がありません</div>
              )}
            </Masonry>
          </TabsContent>
          {isMe && (
            <TabsContent value="medeHistory">
              <Masonry columns={{ 845: 2, 1024: 3, 1280: 4 }} gap={20}>
                {cutedPosts.length > 0 ? (
                  cutedPosts.map((post) => (
                    <PostCard post={post} key={post.id} />
                  ))
                ) : (
                  <div>まだ鳥さんを愛でてません</div>
                )}
              </Masonry>
            </TabsContent>
          )}
        </Tabs>
      </div>
    </>
  );
};
