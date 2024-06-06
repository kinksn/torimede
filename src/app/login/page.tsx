"use client";

import { Login } from "@/types";
import { signIn, signOut, useSession } from "next-auth/react";
import React from "react";
import { useForm } from "react-hook-form";

const LoginPage = () => {
  const { data, status } = useSession();
  console.log("data = " + JSON.stringify(data));
  console.log("status = " + status);

  const { register, handleSubmit } = useForm<Login>({
    defaultValues: { email: "", password: "" },
  });

  const login = async (data: Login) => {
    console.log("data = ", data);
    const res = await signIn("credentials", {
      redirect: false,
      email: data.email,
      password: data.password,
    });

    console.log("res = ", res);

    if (res?.error) {
      console.error(res.error);
    } else {
      console.log("Signed in successfully");
    }
  };

  return (
    <div>
      <form
        onSubmit={handleSubmit(login)}
        className="flex flex-col items-center justify-center gap-5 mt-10"
      >
        <input
          type="text"
          {...register("email", { required: true })}
          placeholder="user@example.com"
          className="input input-bordered w-full max-w-lg"
        />
        <input
          type="password"
          {...register("password", { required: true })}
          className="input input-bordered w-full max-w-lg"
        />
        <button
          type="submit"
          className="btn bg-yellow-400 hover:bg-yellow-500 w-full max-w-lg text-gray-900"
        >
          Login
        </button>
      </form>
      <button onClick={() => signIn("google")}>google</button>
      <button onClick={() => signOut()}>signout</button>
    </div>
  );
};

export default LoginPage;
