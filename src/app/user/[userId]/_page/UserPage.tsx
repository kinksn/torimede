import { GetUserOutput } from "@/app/api/user/model";
import { UserProfile } from "@/app/user/[userId]/_components/UserProfile";
import BackButton from "@/components/BackButton";
import PostCard from "@/components/PostCard";
import { InitialPagePathSetter } from "@/components/InitialPagePathSetter";
import { Session } from "next-auth";
import React from "react";

type UserPageProps = {
  profile: GetUserOutput;
  session: Session | null;
};

export const UserPage = ({ profile, session }: UserPageProps) => {
  const { profile: userProfile, posts, cutedPosts } = profile;

  const isMe = session?.user?.id === userProfile.id;

  return (
    <div>
      <InitialPagePathSetter />
      <BackButton />
      <UserProfile userProfile={userProfile} readonly={!isMe} />

      <div role="tablist" className="tabs tabs-bordered">
        <input
          type="radio"
          name="my_tabs_1"
          role="tab"
          className="tab"
          aria-label="投稿一覧"
          defaultChecked
        />
        <div role="tabpanel" className="tab-content">
          {posts.length > 0 ? (
            posts.map((post) => (
              <PostCard post={post} key={post.id} session={session} />
            ))
          ) : (
            <div>まだ投稿がありません</div>
          )}
        </div>

        {isMe && (
          <>
            <input
              type="radio"
              name="my_tabs_1"
              role="tab"
              className="tab"
              aria-label="めで履歴"
            />
            <div role="tabpanel" className="tab-content">
              {cutedPosts.length > 0 ? (
                cutedPosts.map((post) => (
                  <PostCard post={post} key={post.id} session={session} />
                ))
              ) : (
                <div>まだ鳥さんを愛でてません</div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
