"use client";

import axios from "axios";
import Flag from "@/components/assets/icon/flag.svg";
import SpinnerIcon from "@/components/assets/icon/color-fixed/spinner.svg";
import { Button } from "@/components/basic/Button";
import {
  PostId,
  PostReportInput,
  postReportInputSchema,
  PostReportReasonEnum,
} from "@/app/api/post/model";
import { Modal } from "@/components/basic/Modal";
import { SVGIcon } from "@/components/ui/SVGIcon";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/basic/Textarea";
import { TextButton } from "@/components/basic/TextButton";
import { toast } from "sonner";
import { RadioButton } from "@/components/basic/RadioButton";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { UserId } from "@/app/api/user/model";
import { REPORT_CATEGORY_DISPLAY } from "@/lib/constants/report";

const reportOptions: { value: PostReportReasonEnum; label: string }[] = [
  { value: "COPYRIGHT", label: REPORT_CATEGORY_DISPLAY["COPYRIGHT"] },
  { value: "DEFAMATION", label: REPORT_CATEGORY_DISPLAY["DEFAMATION"] },
  { value: "ADULT_VIOLENCE", label: REPORT_CATEGORY_DISPLAY["ADULT_VIOLENCE"] },
  { value: "OTHER", label: REPORT_CATEGORY_DISPLAY["OTHER"] },
];

type ReportFormProps = {
  postId: PostId;
  userId: UserId;
};

export const ReportForm = ({ postId, userId }: ReportFormProps) => {
  const [isShowModal, setIsShowModal] = useState(false);

  const form = useForm<PostReportInput>({
    mode: "onChange",
    resolver: zodResolver(postReportInputSchema),
    defaultValues: { reason: undefined, content: "" },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (report: PostReportInput) => {
      return axios.post(`/api/post/${postId}/${userId}/report`, report);
    },
    onError: (error) => {
      toast.error("報告の送信に失敗しました");
      console.error(error);
    },
    onSuccess: async () => {
      toast.success("報告が完了しました");
      setIsShowModal(false);
    },
  });

  const onSubmit = (data: PostReportInput) => {
    mutate(data);
  };

  return (
    <Modal
      open={isShowModal}
      onOpenChange={setIsShowModal}
      title="報告する"
      description="該当する項目をチェックしてください"
      triggerContentClassName="w-fit mx-auto"
      triggerContent={
        <div className="flex items-center justify-center text-primary-600 w-fit mx-auto">
          <SVGIcon svg={Flag} className="w-5" />
          <p className="leading-none text-typography-sm underline">
            この投稿を報告
          </p>
        </div>
      }
      isShowFooter={false}
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-5"
        >
          <FormField
            control={form.control}
            name="reason"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <RadioButton options={reportOptions} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea
                    placeholder="詳細をお聞かせください（任意）"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex gap-2 items-center justify-end">
            <TextButton onClick={() => setIsShowModal(false)}>
              キャンセル
            </TextButton>
            <Button
              type="submit"
              disabled={isPending}
              iconLeft={
                isPending ? (
                  <SVGIcon svg={SpinnerIcon} className="w-6 animate-spin" />
                ) : undefined
              }
            >
              送信
            </Button>
          </div>
        </form>
      </Form>
    </Modal>
  );
};
