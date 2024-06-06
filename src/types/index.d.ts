import { z } from "zod";

export type FormInputPost = {
  title: string;
  content: string;
  tagId?: string;
};

export type Tag = {
  id: string;
  name: string;
};

export type Login = {
  email: string;
  password: string;
};

const signUpFormSchema = z
  .object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
  })
  .strict();

export type SignUp = z.infer<typeof signUpFormSchema>;
