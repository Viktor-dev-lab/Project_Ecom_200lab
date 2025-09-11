import { z } from 'zod';

export enum CategoryStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  DELETED = 'deleted'
}

export const CategorySchema = z.object({
  id: z.uuid({ message: "ID must be a valid UUID" }),
  name: z.string().min(2, 'name must be at least 2 characters').default("Untitled Category"),
  image: z.url({ message: "Image must be a valid URL" }).optional(),
  description: z.string().optional(),
  position: z.number().int().min(0, 'invalid position').default(0),
  parentId: z.string().uuid().nullable().optional(),
  status: z.enum(CategoryStatus),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Category = z.infer<typeof CategorySchema> & {children? : Category[]};