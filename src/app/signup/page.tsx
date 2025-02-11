"use client";

import Logo from "@/components/assets/logo-color-fixed.svg";
import GoogleIcon from "@/components/assets/icon/color-fixed/google.svg";
// import LINEIcon from "@/components/assets/icon/color-fixed/line.svg";
// import XIcon from "@/components/assets/icon/color-fixed/x.svg";
import { SVGIcon } from "@/components/ui/SVGIcon";
import { signIn } from "next-auth/react";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useCreateUser } from "@/hooks/useUsers";
import { SignUpForm, signUpFormSchema } from "@/app/api/user/model";
import { Form, FormField } from "@/components/ui/form";
import { Input } from "@/components/basic/Input";
import { Button } from "@/components/basic/Button";

const SignUpPage = () => {
  const form = useForm<SignUpForm>({
    defaultValues: { name: "", email: "", password: "" },
    resolver: zodResolver(signUpFormSchema),
  });
  const { mutate: createUser } = useCreateUser();
  const router = useRouter();

  const signup = (data: SignUpForm) => {
    createUser(data, {
      onSuccess: () => {
        router.push("/");
        router.refresh();
      },
      onError: (error) => {
        alert(error?.message);
      },
    });
  };

  const handleSubmit: SubmitHandler<SignUpForm> = async (data) => {
    signup(data);
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
              name="name"
              render={({ field, fieldState }) => (
                <Input
                  label="ニックネーム"
                  requirement="required"
                  placeholder="片岡ピピ"
                  className="w-full"
                  error={!!fieldState.error}
                  {...field}
                />
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field, fieldState }) => (
                <Input
                  label="メールアドレス"
                  requirement="required"
                  placeholder="pipi@example.com"
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
                  type="password"
                  label="パスワード"
                  requirement="required"
                  placeholder="6文字以上入力してください"
                  className="w-full"
                  error={!!fieldState.error}
                  {...field}
                />
              )}
            />
            <Button size={"lg"} type="submit" className="w-full justify-center">
              登録
            </Button>
          </form>
        </Form>
        <Button
          iconLeft={<SVGIcon svg={GoogleIcon} className="w-6" />}
          colorTheme={"outline"}
          className="w-full justify-center"
          onClick={() => signIn("google", { callbackUrl: "/" })}
        >
          Googleアカウント
        </Button>
        {/* <Button
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
      </Button> */}
      </div>
    </div>
  );
};

export default SignUpPage;
