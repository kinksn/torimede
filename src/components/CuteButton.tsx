"use client";

import axiosInstance from "@/lib/axios";
import GoogleIcon from "@/components/assets/icon/color-fixed/google.svg";
import Image from "next/image";
import { signIn } from "next-auth/react";
import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { PostId } from "@/app/api/post/model";
import { cn } from "@/lib/utils";
import { Session } from "next-auth";
import {
  CreateCuteOutput,
  MAX_CUTE_COUNT,
} from "@/app/api/cute/[postId]/model";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/basic/Button";
import { Form, FormField } from "@/components/ui/form";
import { SubmitHandler, useForm } from "react-hook-form";
import { LoginForm, loginFormSchema } from "@/app/api/user/model";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/basic/Input";
import { SVGIcon } from "@/components/ui/SVGIcon";

const addCute = async ({
  postId,
  cuteCount,
}: {
  postId: PostId;
  cuteCount: number;
}) => {
  const response = await axiosInstance.post<CreateCuteOutput>(
    `/cute/${postId}`,
    {
      cuteCount,
    }
  );
  return response.data;
};

type CuteButtonProps = {
  postId: PostId;
  className?: string;
  userCuteCount: number;
  session: Session | null;
};

export const CuteButton = ({
  postId,
  className,
  userCuteCount: propsUserCuteCount,
  session,
}: CuteButtonProps) => {
  const [userCuteCount, setUserCuteCount] = useState(propsUserCuteCount);
  const [tempCuteCount, setTempCuteCount] = useState(0);
  const [isClapping, setIsClapping] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const router = useRouter();

  const { mutate } = useMutation({
    mutationFn: () => addCute({ postId, cuteCount: tempCuteCount }),
    onSuccess: (data) => {
      setUserCuteCount(data.totalCuteCount);
      setTempCuteCount(0);
      router.refresh();
    },
    onError: (error) => {
      console.error("Error adding cute:", error);
    },
  });

  useEffect(() => {
    if (isClapping) return;
    const timeoutId = setTimeout(() => {
      if (tempCuteCount > 0) {
        mutate();
      }
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [isClapping, tempCuteCount, mutate]);

  const handleCute = () => {
    if (userCuteCount + tempCuteCount < MAX_CUTE_COUNT) {
      setTempCuteCount((count) => count + 1);
      setIsClapping(true);
      setTimeout(() => setIsClapping(false), 300);
    }
  };

  const handleClick = () => {
    if (!!session) {
      handleCute();
    } else {
      setIsDialogOpen(true);
    }
  };

  return (
    <>
      <Image
        onClick={handleClick}
        src={`${process.env.NEXT_PUBLIC_ASSET_BASE_URL}/image/mede-button/medebutton-default.png`}
        className={cn("w-[68px] cursor-pointer", className)}
        alt="cute image"
        width={200}
        height={200}
      />
      {!session && isDialogOpen && (
        <CofirmSinginDialog isOpen={isDialogOpen} setIsOpen={setIsDialogOpen} />
      )}
    </>
  );
};

const CofirmSinginDialog = ({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
}) => {
  const router = useRouter();

  const form = useForm<LoginForm>({
    defaultValues: { email: "", password: "" },
    resolver: zodResolver(loginFormSchema),
  });

  const login = async (data: LoginForm) => {
    const res = await signIn("credentials", {
      redirect: false,
      email: data.email,
      password: data.password,
    });

    if (res?.error) {
      alert("could not login your account");
    } else {
      router.push("/");
    }
  };

  const handleSubmit: SubmitHandler<LoginForm> = async (data) => {
    login(data);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>無料登録して鳥さんをメデましょう</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center justify-center gap-5 bg-white rounded-20 max-w-[388px] w-full p-10 max-sm:p-5">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="flex flex-col w-full gap-5"
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field, fieldState }) => (
                  <Input
                    label="メールアドレス"
                    requirement="required"
                    placeholder="user@example.com"
                    className="w-full"
                    error={!!fieldState.error}
                    {...field}
                  />
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field, fieldState }) => (
                  <Input
                    label="パスワード"
                    type="password"
                    requirement="required"
                    placeholder="6文字以上入力してください"
                    className="w-full"
                    error={!!fieldState.error}
                    {...field}
                  />
                )}
              />
              <Button
                size={"lg"}
                type="submit"
                className="w-full justify-center"
              >
                ログイン
              </Button>
            </form>
          </Form>
          <Button
            iconLeft={<SVGIcon svg={GoogleIcon} className="w-6" />}
            colorTheme={"outline"}
            className="w-full justify-center"
            onClick={() => signIn("google", { callbackUrl: "/" })}
          >
            Googleアカウントでログイン
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
