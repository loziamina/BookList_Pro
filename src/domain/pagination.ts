import { z } from "zod";

export function paginatedResponseSchema<ItemSchema extends z.ZodType>(
  itemSchema: ItemSchema,
) {
  return z.object({
    items: z.array(itemSchema),
    page: z.number().int().positive(),
    limit: z.number().int().positive(),
    total: z.number().int().nonnegative(),
    totalPages: z.number().int().nonnegative(),
  });
}

export type PaginatedResponse<Item> = {
  items: Item[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};
