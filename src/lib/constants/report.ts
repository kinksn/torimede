import { ReportReason } from "@prisma/client";

// 報告フォームやメールテンプレートでの表示に使用
export const REPORT_CATEGORY_DISPLAY: Record<ReportReason, string> = {
  COPYRIGHT: "著作権違反",
  DEFAMATION: "誹謗中傷",
  ADULT_VIOLENCE: "ポルノ・暴力",
  OTHER: "その他",
} as const;
