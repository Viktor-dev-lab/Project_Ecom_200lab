import { z } from 'zod';
import { CategoryStatus } from './model'

export const CategoryUpdateSchema = z.object({
  id: z.string(),
  name: z.string(),
  image: z.string().optional(),
  description: z.string().optional(),
  parentId: z.string().nullable().optional(),
  status: z.enum(CategoryStatus),
});

export type CategoryUpdateDTO = z.infer<typeof CategoryUpdateSchema>;

export const CategoryCreateSchema = z.object({
  name: z.string().min(3, { message: "Name must be at least 3 characters" }),
  image: z.string().url({ message: "Image must be a valid URL" }),
  description: z.string().optional(),
  parentId: z.string().uuid({ message: "Parent ID must be a valid UUID" }).nullable().optional(),
});

export type CategoryCreateDTO = z.infer<typeof CategoryCreateSchema>;