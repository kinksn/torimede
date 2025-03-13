import { GetUserProfile } from "@/app/api/user/model";
import { METADATA_TITLE } from "@/app/shared-metadata";
import { Avatar } from "@/components/basic/Avatar";
import { PillButton } from "@/components/basic/PillButton";
import Link from "next/link";

type UserProfile = {
  userProfile: GetUserProfile;
  readonly: boolean;
};

export const UserProfile = ({ userProfile, readonly }: UserProfile) => {
  if (readonly) {
    return <ReadonlyProfile userProfile={userProfile} />;
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <Avatar profileImage={userProfile.image} size={"lg"} />
      <h1 className="text-typography-xl font-bold font-zenMaruGothic">
        {userProfile.name}
      </h1>
      <PillButton colorTheme={"secondary"} className="mt-2" asChild>
        <Link href={`/user/${userProfile.id}/edit`}>
          {METADATA_TITLE.user.edit}
        </Link>
      </PillButton>
    </div>
  );
};

const ReadonlyProfile = ({ userProfile }: { userProfile: GetUserProfile }) => {
  return (
    <div className="flex items-center justify-center flex-col">
      <Avatar profileImage={userProfile.image} size={"lg"} />
      <h1 className="text-typography-xl font-bold font-zenMaruGothic">
        {userProfile.name}
      </h1>
    </div>
  );
};
