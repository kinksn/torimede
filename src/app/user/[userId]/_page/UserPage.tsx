"use client";

import ButtonAction from "@/components/ButtonAction";
import { GetUserOutput, GetUserPosts } from "@/app/api/user/model";
import { UserProfile } from "@/app/user/[userId]/_components/UserProfile";
import { PostImage } from "@/components/PostImage";
import { InitialPagePathSetter } from "@/components/InitialPagePathSetter";
import { Session } from "next-auth";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// メインソンリーーレイアウト実現ライブラリ：https://github.com/sibiraj-s/react-layout-masonry#readme
// 本家だとSSR時にwindowオブジェクトがエラーになるバグがあったため直接プロジェクトに入れて読み込んでいる
import Masonry from "@/components/react-layout-masonry";
import { KiraImage } from "@/app/user/[userId]/_components/KiraImage";

const kiraPostsTabTextStyle =
  "bg-gradient-to-r from-[#E87E3D] via-[#ECC707] to-[#39ADF0] inline-block text-transparent bg-clip-text";

type UserPageProps = {
  profile: GetUserOutput;
  session: Session | null;
};

export const UserPage = ({ profile, session }: UserPageProps) => {
  const { profile: userProfile, posts, mededPosts, kiraPosts } = profile;

  const isMe = session?.user?.id === userProfile.id;

  return (
    <>
      <InitialPagePathSetter />
      <div className="max-sm:mx-auto">
        <UserProfile userProfile={userProfile} readonly={!isMe} />
        <div className="mt-10 bg-white py-10 max-sm:py-5 rounded-20 px-5">
          {isMe ? (
            <Tabs defaultValue="myPost" className="max-w-[1600px] mx-auto">
              <TabsList className="grid grid-cols-3 max-w-fit h-12 p-0 bg-transparent mb-5">
                <TabsTrigger
                  value="myPost"
                  className="relative px-4 py-0 h-11 flex justify-center before:content-[''] before:absolute before:opacity-0 before:block before:w-full before:rounded-full before:h-1 before:bg-primary-900 before:left-0 before:bottom-0 data-[state=active]:before:opacity-100 font-zenMaruGothic text-typography-sm !text-textColor-basic font-bold rounded-tr-md rounded-tl-md rounded-bl-none rounded-br-none data-[state=active]:bg-primary-50 !shadow-none "
                >
                  投稿一覧
                </TabsTrigger>
                <TabsTrigger
                  value="medeHistory"
                  className="relative px-4 py-0 h-11 flex justify-center before:content-[''] before:absolute before:opacity-0 before:block before:w-full before:rounded-full before:h-1 before:bg-primary-900 before:left-0 before:bottom-0 data-[state=active]:before:opacity-100 font-zenMaruGothic text-typography-sm !text-textColor-basic font-bold rounded-tr-md rounded-tl-md rounded-bl-none rounded-br-none data-[state=active]:bg-primary-50 !shadow-none"
                >
                  めで履歴
                </TabsTrigger>
                {!!kiraPosts?.length && (
                  <TabsTrigger
                    value="kiraPosts"
                    className="relative px-4 py-0 h-11 flex justify-center before:content-[''] before:absolute before:opacity-0 before:block before:w-full before:rounded-full before:h-1 before:bg-primary-900 before:left-0 before:bottom-0 data-[state=active]:before:opacity-100 font-zenMaruGothic text-typography-sm !text-textColor-basic font-bold rounded-tr-md rounded-tl-md rounded-bl-none rounded-br-none data-[state=active]:bg-primary-50 !shadow-none"
                  >
                    <span className={kiraPostsTabTextStyle}>キラ投稿</span>
                  </TabsTrigger>
                )}
              </TabsList>
              <TabsContent value="myPost">
                <MyPosts posts={posts} isMe={isMe} />
              </TabsContent>
              <TabsContent value="medeHistory">
                {mededPosts?.length ? (
                  <Masonry columns={{ 845: 2, 1024: 3, 1280: 4 }} gap={20}>
                    {mededPosts.map((post) => (
                      <PostImage post={post} key={post.id} />
                    ))}
                  </Masonry>
                ) : (
                  <div>まだ鳥さんを愛でてません</div>
                )}
              </TabsContent>
              {!!kiraPosts?.length && (
                <TabsContent value="kiraPosts">
                  <Masonry
                    columns={{ 430: 1, 845: 2, 1024: 3, 1280: 4 }}
                    gap={20}
                  >
                    {kiraPosts.map((post) => (
                      <KiraImage post={post} key={post.id} />
                    ))}
                  </Masonry>
                </TabsContent>
              )}
            </Tabs>
          ) : (
            <>
              <h2 className="font-bold text-typography-xl max-sm:text-typography-lg max-sm:font-bold leading-normal text-center font-zenMaruGothic mb-10 max-sm:mb-5">
                投稿一覧
              </h2>
              <div className="max-w-[1600px] mx-auto">
                <MyPosts posts={posts} isMe={isMe} />
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

type MyPostsProps = {
  posts: GetUserPosts | undefined;
  isMe: boolean;
};

const MyPosts = ({ posts, isMe }: MyPostsProps) => {
  return (
    <>
      {posts?.length ? (
        <Masonry columns={{ 845: 2, 1024: 3, 1280: 4 }} gap={20}>
          {posts.map((post) => (
            <PostImage
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
          ))}
        </Masonry>
      ) : (
        <div>まだ投稿がありません</div>
      )}
    </>
  );
};
