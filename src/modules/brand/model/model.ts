import { z } from 'zod';
import { BrandDescriptionTooLongError, BrandImageInvalidUrlError, BrandInvalidIdError, BrandNameTooShortError, BrandStatusInvalidError, BrandTaglineTooLongError } from '../../../share/model/base-errors';

export enum BrandStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  DELETED = 'deleted'
}

export const BrandSchema = z.object({
  id: z.uuid(BrandInvalidIdError.message),
  name: z.string().min(2, BrandNameTooShortError.message),
  tag_line: z.string().max(150, BrandTaglineTooLongError.message).optional(),
  image: z.url(BrandImageInvalidUrlError.message).optional(),
  description: z.string().max(255, BrandDescriptionTooLongError.message).optional(),
  status: z.enum(BrandStatus, BrandStatusInvalidError.message),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Brand = z.infer<typeof BrandSchema>;