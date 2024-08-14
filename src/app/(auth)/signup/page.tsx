"use client";

import React from "react";
import { SignUp } from "@/types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signUpFormSchema } from "@/app/api/user/schema";
import { useRouter } from "next/navigation";
import { useCreateUser } from "@/hooks/useUsers";

const SignUpPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUp>({
    defaultValues: { name: "", email: "", password: "" },
    resolver: zodResolver(signUpFormSchema),
  });
  const { mutate: createUser } = useCreateUser();
  const router = useRouter();

  const signup = (data: SignUp) => {
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

  return (
    <div>
      <form
        onSubmit={handleSubmit(signup)}
        className="flex flex-col items-center justify-center gap-5 mt-10"
      >
        <div className="w-full max-w-lg flex flex-col gap-2 ">
          <input
            type="text"
            {...register("name", { required: true })}
            placeholder="your name"
            className="input input-bordered w-full max-w-lg"
          />
          {errors.name && (
            <p className="text-red-500 text-left w-full max-w-lg text-xs ml-1">
              {errors.name.message}
            </p>
          )}
        </div>
        <div className="w-full max-w-lg flex flex-col gap-2 ">
          <input
            type="text"
            {...register("email", { required: true })}
            placeholder="your email"
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
            placeholder="your password"
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
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default SignUpPage;
