import { User } from "@prisma/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

type PostUserInput = Pick<User, "name" | "email" | "password">;

const createUser = async (data: PostUserInput) => {
  return await axios.post<PostUserInput>("/api/user", data);
};

export function useCreateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (user: PostUserInput) => createUser(user),
    onError: (error) => {
      return error;
    },
    onSettled: async (_, error) => {
      if (!error) {
        await queryClient.invalidateQueries({ queryKey: ["tags"] });
      }
    },
  });
}
