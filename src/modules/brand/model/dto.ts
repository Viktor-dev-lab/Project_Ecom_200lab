import { z } from 'zod';
import { BrandDescriptionTooLongError, BrandImageInvalidUrlError, BrandNameTooShortError, BrandTaglineTooLongError } from '../../../share/model/base-errors';
import { ModelStatus } from '../../../share/model/base-model';


export const BrandUpdateSchema = z.object({
  name: z.string().min(2, BrandNameTooShortError.message).optional(),
  image: z.url(BrandImageInvalidUrlError.message).optional(),
  tagline: z.string().max(150, BrandTaglineTooLongError.message).optional(),
  description: z.string().max(255, BrandDescriptionTooLongError.message).optional(),
  status: z.enum(ModelStatus).optional(),
});

export const BrandCreateSchema = z.object({
  name: z.string().min(2, BrandNameTooShortError.message),
  image: z.url(BrandImageInvalidUrlError.message),
  tagline: z.string().max(150, BrandTaglineTooLongError.message).optional(),
  description: z.string().max(255, BrandDescriptionTooLongError.message).optional(),
});

export const BrandFilterDTOSchema = z.object({
  name: z.string().min(2, BrandNameTooShortError.message).optional(),
  status: z.enum(ModelStatus).optional(),
});

export type BrandCreateDTO = z.infer<typeof BrandCreateSchema>;
export type BrandUpdateDTO = z.infer<typeof BrandUpdateSchema>;
export type BrandFilterDTO = z.infer<typeof BrandFilterDTOSchema>;