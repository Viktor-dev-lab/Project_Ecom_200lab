import { z } from 'zod';

export enum CategoryStatus {
  Active = 'active',
  Inactive = 'inactive',
  Deleted = 'deleted'
}

export const CategorySchema = z.object({
  id: z.uuid({ message: "ID must be a valid UUID" }),
  name: z.string().min(3, 'name must be at least 3 characters').default("Untitled Category"),
  image: z.url({ message: "Image must be a valid URL" }).optional(),
  description: z.string().optional(),
  position: z.number().int().min(0, 'invalid position').default(0),
  parentId: z.string().uuid().nullable().optional(),
  status: z.enum(CategoryStatus),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Category = z.infer<typeof CategorySchema>;