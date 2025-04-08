import { PostReportReasonEnum } from "@/app/api/post/model";

// 報告理由のenumから日本語へのマッピング
// 報告フォームやメールテンプレートでの表示に使用
export const REPORT_CATEGORY_DISPLAY: Record<PostReportReasonEnum, string> = {
  COPYRIGHT: "著作権違反",
  DEFAMATION: "誹謗中傷",
  ADULT_VIOLENCE: "ポルノ・暴力",
  OTHER: "その他",
} as const;
