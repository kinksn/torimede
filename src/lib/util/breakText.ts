export const breakText = (text: string | undefined) =>
  text?.replace(/<br\s*\/?>/gi, "\n");
