"use client";

import Logo from "@/components/assets/logo-color-fixed.svg";
import GoogleIcon from "@/components/assets/icon/color-fixed/google.svg";
import LINEIcon from "@/components/assets/icon/color-fixed/line.svg";
import XIcon from "@/components/assets/icon/color-fixed/x.svg";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SVGIcon } from "@/components/ui/SVGIcon";
import { Form, FormField } from "@/components/ui/form";
import { Input } from "@/components/basic/Input";
import { Button } from "@/components/basic/Button";
import { LoginForm, loginFormSchema } from "@/app/api/user/model";

const LoginPage = () => {
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
    <div className="flex flex-col gap-5 w-full h-screen max-sm:h-auto items-center justify-center px-5 max-sm:py-10">
      <div className="flex flex-col items-center gap-5">
        <SVGIcon svg={Logo} className="w-[180px]" />
        <p className="font-bold text-center">
          連携するアカウントを選択してください
        </p>
      </div>
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
            <Button size={"lg"} type="submit" className="w-full justify-center">
              ログイン
            </Button>
          </form>
        </Form>
        <Button
          iconLeft={<SVGIcon svg={GoogleIcon} className="w-6" />}
          colorTheme={"outline"}
          className="w-full justify-center"
          onClick={() => {
            signIn("google", { callbackUrl: "/" });
          }}
        >
          Googleアカウント
        </Button>
        <Button
          iconLeft={<SVGIcon svg={LINEIcon} className="w-6" />}
          colorTheme={"outline"}
          className="w-full justify-center"
          onClick={() => signIn("line", { callbackUrl: "/" })}
        >
          LINEアカウント
        </Button>
        <Button
          iconLeft={<SVGIcon svg={XIcon} className="w-6" />}
          colorTheme={"outline"}
          className="w-full justify-center"
          onClick={() => signIn("twitter", { callbackUrl: "/" })}
        >
          X(Twitter)アカウント
        </Button>
      </div>
    </div>
  );
};

export default LoginPage;
