import { z } from "zod";

export const createCategorySchema = {
  title: z.string(),
  Icon: z.string(),
 /*  color: z.string().regex(/^#[A-fa-f0-9]{6}$/), */
  color: z.string(),
};

const createCategoryObject = z.object(createCategorySchema);
export type CreateCategoryDTO = z.infer<typeof createCategoryObject>;
