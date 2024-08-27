import { Tag } from "@prisma/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const getTags = async () => {
  return (await axios.get<Tag[]>("/api/tag")).data;
};

const createTag = async (data: Pick<Tag, "name">) => {
  return await axios.post<Tag>("/api/tag", data);
};

const deleteTag = async (id: string) => {
  return await axios.delete(`/api/tag/${id}`);
};

export function useGetTags() {
  return useQuery({
    queryKey: ["tags"],
    queryFn: getTags,
  });
}

export function useCreateTag() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (tag: Pick<Tag, "name">) => createTag(tag),
    onSettled: async (_, error) => {
      if (!error) {
        await queryClient.invalidateQueries({ queryKey: ["tags"] });
      }
    },
  });
}

export function useDeleteTag() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteTag(id),
    onSettled: async (_, error) => {
      if (!error) {
        await queryClient.invalidateQueries({ queryKey: ["tags"] });
      }
    },
  });
}
