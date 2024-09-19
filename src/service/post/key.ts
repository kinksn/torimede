export const postKeys = {
  all: ["posts"] as const,
  lists: () => [...postKeys.all, "list"] as const,
  list: (filters: string) => [...postKeys.lists(), { filters }] as const,
  infiniteList: () => [...postKeys.all, "infiniteList"] as const,
  infiniteListWithFilters: (filters: string) =>
    [...postKeys.infiniteList(), { filters }] as const,
  details: () => [...postKeys.all, "detail"] as const,
  detail: (id: number) => [...postKeys.details(), id] as const,
};
