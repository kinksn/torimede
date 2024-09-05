import { z } from "zod";

export const idWithBrandSchema = <T extends string>(brand: T) =>
  z.string().brand(brand);
