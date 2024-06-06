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
