import { z } from 'zod';
import { ErrBrandIdMustBeValidUUID, ErrCategoryIdMustBeValidUUID, ErrFromPriceMustBePositive, ErrNameMustBeAtLeast2Characters, ErrPriceMustBePositive, ErrQuantityMustBeNonnegative, ErrSalePriceMustBeNonnegative, ErrToPriceMustBePositive } from './error';

export const ProductCreateSchema = z.object({
  name: z.string().min(2, ErrNameMustBeAtLeast2Characters.message),
  price: z.number().positive(ErrPriceMustBePositive.message),
  salePrice: z.number().nonnegative(ErrSalePriceMustBeNonnegative.message),
  quantity: z.number().int().nonnegative(ErrQuantityMustBeNonnegative.message),
  brandId: z.uuid(ErrBrandIdMustBeValidUUID.message),
  categoryId: z.uuid(ErrCategoryIdMustBeValidUUID.message),
  content: z.string().optional(),
  description: z.string().optional(),
});


export const ProductUpdateSchema = z.object({
  name: z.string().min(2, ErrNameMustBeAtLeast2Characters.message).optional(),
  price: z.number().positive(ErrPriceMustBePositive.message).optional(),
  salePrice: z.number().nonnegative(ErrSalePriceMustBeNonnegative.message).optional(),
  quantity: z.number().int().nonnegative(ErrQuantityMustBeNonnegative.message).optional(),
  brandId: z.uuid(ErrBrandIdMustBeValidUUID.message).optional(),
  categoryId: z.uuid(ErrCategoryIdMustBeValidUUID.message).optional(),
  content: z.string().optional(),
  description: z.string().optional(),
});


export const ProductCondSchema = z.object({
  fromPrice: z.number().positive(ErrFromPriceMustBePositive.message).optional(),
  toPrice: z.number().positive(ErrToPriceMustBePositive.message).optional(),
  brandId: z.uuid(ErrBrandIdMustBeValidUUID.message).optional(),
  categoryId: z.uuid(ErrCategoryIdMustBeValidUUID.message).optional(),
});

export type ProductCreateDTO = z.infer<typeof ProductCreateSchema>;
export type ProductUpdateDTO = z.infer<typeof ProductUpdateSchema>;
export type ProductCondDTO = z.infer<typeof ProductCondSchema>;