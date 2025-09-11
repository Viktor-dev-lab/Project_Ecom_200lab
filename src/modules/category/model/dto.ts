import { z } from 'zod';
import { CategoryStatus } from './model'

export const CategoryUpdateSchema = z.object({
  name: z.string().min(2, 'name must be at least 2 characters').optional(),
  image: z.string().optional(),
  description: z.string().max(255, 'description must be at most 255 characters').optional(),
  parentId: z.uuid().nullable().optional(),
  status: z.enum(CategoryStatus).optional(),
});

export type CategoryUpdateDTO = z.infer<typeof CategoryUpdateSchema>;

export const CategoryCreateSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  image: z.string().url({ message: "Image must be a valid URL" }),
  description: z.string().optional(),
  parentId: z.uuid({ message: "Parent ID must be a valid UUID" }).nullable().optional(),
});

export type CategoryCreateDTO = z.infer<typeof CategoryCreateSchema>;

export const CategoryFilterDTOSchema = z.object({
  name: z.string().min(2, 'name must be at least 3 characters').optional(),
  parentId: z.string().uuid().optional(),
  status: z.enum(CategoryStatus).optional(),
});

export type CategoryFilterDTO = z.infer<typeof CategoryFilterDTOSchema>;