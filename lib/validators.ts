import { z } from "zod";

/**
 * Sign In Form Validation Schema
 * Validates email format (min 4 chars) and password (min 3 chars).
 */
export const signInFormSchema = z.object({
  email: z
    .string()
    .min(4, "Email must be at least 4 characters")
    .email("Invalid email address format"),
  password: z
    .string()
    .min(3, "Password must be at least 3 characters"),
});

export type SignInFormData = z.infer<typeof signInFormSchema>;

/**
 * Sign Up Form Validation Schema
 * Validates name, email, password, and confirmPassword.
 * Uses .refine() to enforce password === confirmPassword and attaches error to confirmPassword field.
 */
export const signUpFormSchema = z
  .object({
    name: z
      .string()
      .min(3, "Name must be at least 3 characters"),
    email: z
      .string()
      .min(4, "Email must be at least 4 characters")
      .email("Invalid email address format"),
    password: z
      .string()
      .min(3, "Password must be at least 3 characters"),
    confirmPassword: z
      .string()
      .min(3, "Confirm password must be at least 3 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type SignUpFormData = z.infer<typeof signUpFormSchema>;

