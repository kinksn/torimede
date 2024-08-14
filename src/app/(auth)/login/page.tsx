"use client";

import { Login } from "@/types";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const loginFormSchema = z
  .object({
    email: z.string().email("メールアドレスの形式で入力してください"),
    password: z.string().min(6, "6文字以上入力してください"),
  })
  .strict();

const LoginPage = () => {
  const { data, status } = useSession();
  const router = useRouter();
  console.log("data = " + JSON.stringify(data));
  console.log("status = " + status);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Login>({
    defaultValues: { email: "", password: "" },
    resolver: zodResolver(loginFormSchema),
  });

  const login = async (data: Login) => {
    const res = await signIn("credentials", {
      redirect: false,
      email: data.email,
      password: data.password,
    });

    console.log("res = ", res);

    if (res?.error) {
      alert("could not login your account");
    } else {
      console.log("Signed in successfully");
      router.push("/");
    }
  };

  return (
    <div>
      <form
        onSubmit={handleSubmit(login)}
        className="flex flex-col items-center justify-center gap-5 mt-10"
      >
        <div className="w-full max-w-lg flex flex-col gap-2 ">
          <input
            type="text"
            {...register("email", { required: true })}
            placeholder="user@example.com"
            className="input input-bordered w-full max-w-lg"
          />
          {errors.email && (
            <p className="text-red-500 text-left w-full max-w-lg text-xs ml-1">
              {errors.email.message}
            </p>
          )}
        </div>
        <div className="w-full max-w-lg flex flex-col gap-2 ">
          <input
            type="password"
            {...register("password", { required: true })}
            className="input input-bordered w-full max-w-lg"
          />
          {errors.password && (
            <p className="text-red-500 text-left w-full max-w-lg text-xs ml-1">
              {errors.password.message}
            </p>
          )}
        </div>
        <button
          type="submit"
          className="btn bg-yellow-400 hover:bg-yellow-500 w-full max-w-lg text-gray-900"
        >
          Login
        </button>
      </form>
      <button onClick={() => signIn("google", { callbackUrl: "/" })}>
        google
      </button>
      <button onClick={() => signOut()}>signout</button>
    </div>
  );
};

export default LoginPage;
