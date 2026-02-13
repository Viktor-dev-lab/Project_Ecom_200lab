import { z } from 'zod';
import { BrandDescriptionTooLongError, BrandImageInvalidUrlError, BrandInvalidIdError, BrandNameTooShortError, BrandStatusInvalidError, BrandTaglineTooLongError } from '../../../share/model/base-errors';
import { ModelStatus } from '../../../share/model/base-model';


export const BrandSchema = z.object({
  id: z.uuid(BrandInvalidIdError.message),
  name: z.string().min(2, BrandNameTooShortError.message),
  tagline: z.string().max(150, BrandTaglineTooLongError.message).optional(),
  image: z.url(BrandImageInvalidUrlError.message).optional(),
  description: z.string().max(255, BrandDescriptionTooLongError.message).optional(),
  status: z.enum(ModelStatus, BrandStatusInvalidError.message),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Brand = z.infer<typeof BrandSchema>;