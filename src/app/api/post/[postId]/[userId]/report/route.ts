import resend from "@/lib/resend";
import { PostId, postReportInputSchema } from "@/app/api/post/model";
import { NextResponse } from "next/server";
import { UserId } from "@/app/api/user/model";
import { EmailTemplate } from "@/app/api/post/[postId]/[userId]/report/EmailTemplate";

type ContextProps = {
  params: {
    postId: PostId;
    userId: UserId;
  };
};

export async function POST(req: Request, context: ContextProps) {
  try {
    const { postId, userId } = context.params;

    const body = postReportInputSchema.parse(await req.json());

    await resend.emails.send({
      from: "トリメデ <noreply@torimede.com>",
      to: ["support@torimede.com"],
      subject: "通報",
      react: EmailTemplate({
        url: `${process.env.NEXT_PUBLIC_BASE_URL}/post/${postId}/${userId}`,
        reason: body.reason,
        content: body.content,
      }),
    });

    return NextResponse.json(
      { message: "Report submitted successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error occurred" },
      { status: 500 }
    );
  }
}
