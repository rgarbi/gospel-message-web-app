import { z } from 'zod'
 
export const LoginFormSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email.' }).trim(),
  password: z
    .string()
    .min(1, { message: 'Please enter a password' })
    .trim(),
})
 
export type LoginFormState =
  | {
      errors?: {
        email?: string[]
        password?: string[]
      }
      message?: string
    }
  | undefined


export const SignUpFormSchema = z.object({
  name: z
  .string()
  .min(1, { message: 'Please enter a name' })
  .trim(),
  email: z.string().email({ message: 'Please enter a valid email.' }).trim(),
  password: z
    .string()
    .min(1, { message: 'Please enter a password' })
    .trim(),
})
   
export type SignUpFormState =
  | {
      errors?: {
        name?: string[]
        email?: string[]
        password?: string[]
      }
      message?: string
    }
  | undefined


export const ForgotPasswordFormSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email.' }).trim(),
})
    
export type ForgotPasswordFormState =
  | {
      errors?: {
        email?: string[]
      }
      message?: string
    }
  | undefined


export const ResetPasswordFormSchema = z.object({
  password: z
    .string()
    .min(1, { message: 'Please enter a password' })
    .trim(),
  passwordConfirmed: z
    .string()
    .min(1, { message: 'Please enter a confirmation password' })
    .trim(),
}).refine((data) => data.password === data.passwordConfirmed, {message: 'Passwords do not match', path:['password']});
    
export type ResetPasswordFormState =
  | {
      errors?: {
        password?: string[]
        passwordConfirmed?: string[]
      }
      message?: string
    }
  | undefined
    