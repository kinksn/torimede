import { GetUserOutput } from "@/app/api/user/model";
import { UserProfile } from "@/app/user/[userId]/_components/UserProfile";
import PostCard from "@/components/PostCard";
import React from "react";

type UserPageProps = {
  profile: GetUserOutput;
  isMe: boolean;
};

export const UserPage = ({ profile, isMe }: UserPageProps) => {
  const { profile: userProfile, posts, cutedPosts } = profile;

  return (
    <div>
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
          {posts ? (
            posts.map((post) => <PostCard post={post} key={post.id} />)
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
              {cutedPosts ? (
                cutedPosts.map((post) => <PostCard post={post} key={post.id} />)
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
