import { PostReportReasonEnum } from "@/app/api/post/model";
import { REPORT_CATEGORY_DISPLAY } from "@/lib/constants/report";

type EmailTemplateProps = {
  url: string;
  reason: PostReportReasonEnum;
  content?: string;
};

export const EmailTemplate = ({ url, reason, content }: EmailTemplateProps) => (
  <div>
    <h1>通報</h1>
    <p>投稿：{url}</p>
    <p>理由：{REPORT_CATEGORY_DISPLAY[reason]}</p>
    {content && <p>内容: {content}</p>}
  </div>
);
