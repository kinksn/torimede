"use client";

import React from "react";
import { SignUp } from "@/types";
import { useForm } from "react-hook-form";

const SignUpPage = () => {
  const { register, handleSubmit } = useForm<SignUp>({
    defaultValues: { name: "", email: "", password: "" },
  });

  const signup = (data: SignUp) => {
    console.log(data);
  };

  return (
    <div>
      <form
        onSubmit={handleSubmit(signup)}
        className="flex flex-col items-center justify-center gap-5 mt-10"
      >
        <input
          type="text"
          {...register("name", { required: true })}
          placeholder="your name"
          className="input input-bordered w-full max-w-lg"
        />
        <input
          type="text"
          {...register("email", { required: true })}
          placeholder="your email"
          className="input input-bordered w-full max-w-lg"
        />
        <input
          type="password"
          {...register("password", { required: true })}
          placeholder="your password"
          className="input input-bordered w-full max-w-lg"
        />
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
