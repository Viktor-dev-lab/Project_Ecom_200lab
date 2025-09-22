import { z } from "zod";
import { ErrBirthdayInvalid, ErrEmailInvalid, ErrFirstNameAtLeast2Chars, ErrGenderInvalid, ErrLastNameAtLeast2Chars, ErrPasswordAtLeast6Chars, ErrRoleInvalid, ErrStatusInvalid } from "./error";

export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
  UNKNOWN = 'unknown',
}

export enum Role {
  USER = 'user',
  ADMIN = 'admin',
}

export enum Status {
  ACTIVE = 'active',
  PENDING = 'pending',
  INACTIVE = 'inactive',
  BANNED = 'banned',
  DELETED = 'deleted',
}

export const UserSchema = z.object({
  id: z.string().uuid(),
  avatar: z.string().nullable().optional(),
  firstName: z.string().min(2, ErrFirstNameAtLeast2Chars.message),
  lastName: z.string().min(2, ErrLastNameAtLeast2Chars.message),
  email: z.email(ErrEmailInvalid.message),
  password: z.string().min(6, ErrPasswordAtLeast6Chars.message),
  salt: z.string().length(29),
  phone: z.string().nullable().optional(),
  address: z.string().nullable().optional(),
  birthday: z.date(ErrBirthdayInvalid.message).nullable().optional(),
  gender: z.enum(Gender, ErrGenderInvalid.message),
  role: z.enum(Role, ErrRoleInvalid.message),
  status: z.enum(Status, ErrStatusInvalid.message).optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});


export const UserRegistrationDTOSchema = UserSchema.pick({
  firstName: true,
  lastName: true,
  email: true,
  password: true,
});

export const UserLoginDTOSchema = UserSchema.pick({
  email: true,
  password: true,
});


export const UserUpdateDTOSchema = z.object({
  avatar: z.string().nullable().optional(),
  firstName: z.string().min(2, ErrFirstNameAtLeast2Chars.message).optional(),
  lastName: z.string().min(2, ErrLastNameAtLeast2Chars.message).optional(),
  email: z.string().email(ErrEmailInvalid.message).optional(),
  password: z.string().min(6, ErrPasswordAtLeast6Chars.message).optional(),
  salt: z.string().length(29).optional(),
  phone: z.string().nullable().optional(),
  address: z.string().nullable().optional(),
  birthday: z.date(ErrBirthdayInvalid.message).nullable().optional(),
  gender: z.enum(Gender, ErrGenderInvalid.message).optional(),
  role: z.enum(Role, ErrRoleInvalid.message).optional(),
  status: z.enum(Status, ErrStatusInvalid.message).optional(),
});


export const UserCondDTOSchema = z.object({
  firstName: z.string().min(2, ErrFirstNameAtLeast2Chars.message).optional(),
  lastName: z.string().min(2, ErrLastNameAtLeast2Chars.message).optional(),
  email: z.string().email(ErrEmailInvalid.message).optional(),
  phone: z.string().nullable().optional(),
  address: z.string().nullable().optional(),
  gender: z.enum(Gender, ErrGenderInvalid.message).optional(),
  role: z.enum(Role, ErrRoleInvalid.message).optional(),
  status: z.enum(Status, ErrStatusInvalid.message).optional(),
});

export type User = z.infer<typeof UserSchema>;
export type UserRegistrationDTO = z.infer<typeof UserRegistrationDTOSchema>;
export type UserLoginDTO = z.infer<typeof UserLoginDTOSchema>;
export type UserUpdateDTO = z.infer<typeof UserUpdateDTOSchema>;
export type UserCondDTO = z.infer<typeof UserCondDTOSchema>;
