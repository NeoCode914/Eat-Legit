import { z } from "zod";

// ─── User Schemas ─────────────────────────────────────────────────────────────

export const userSignupSchema = z
  .object({
    username: z
      .string()
      .min(3, "Username must be at least 3 characters")
      .max(30, "Username must be less than 30 characters")
      .regex(/^[a-zA-Z0-9_]+$/, "Only letters, numbers, and underscores allowed"),
    email: z.string().email("Please enter a valid email address"),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .max(100, "Password is too long"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const userLoginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

// ─── Partner Schemas ──────────────────────────────────────────────────────────

export const partnerSignupSchema = z
  .object({
    name: z
      .string()
      .min(2, "Business name must be at least 2 characters")
      .max(100, "Business name is too long"),
    email: z.string().email("Please enter a valid email address"),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .max(100, "Password is too long"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const partnerLoginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

// ─── Inferred Types ───────────────────────────────────────────────────────────

export type UserSignupSchema = z.infer<typeof userSignupSchema>;
export type UserLoginSchema = z.infer<typeof userLoginSchema>;
export type PartnerSignupSchema = z.infer<typeof partnerSignupSchema>;
export type PartnerLoginSchema = z.infer<typeof partnerLoginSchema>;
