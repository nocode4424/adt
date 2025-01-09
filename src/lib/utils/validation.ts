import { z } from 'zod';

// Common validation schemas
export const emailSchema = z
  .string()
  .email('Please enter a valid email address')
  .min(1, 'Email is required');

export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    'Password must include uppercase, lowercase, number and special character'
  );

export const phoneSchema = z
  .string()
  .regex(/^\+?[1-9]\d{1,14}$/, 'Please enter a valid phone number');

// Form validation schemas
export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export const registrationSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const incidentSchema = z.object({
  type: z.enum(['verbal', 'physical', 'financial', 'other']),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  occurred_at: z.string(),
  location: z.string().optional(),
  sensitivity_level: z.enum(['high', 'medium', 'low']),
  metadata: z.record(z.any()).optional(),
});

export const expenseSchema = z.object({
  amount: z.number().positive('Amount must be positive'),
  category: z.string().min(1, 'Category is required'),
  description: z.string(),
  date: z.string(),
  receipt_url: z.string().url().optional(),
});

// Type inference
export type LoginFormData = z.infer<typeof loginSchema>;
export type RegistrationFormData = z.infer<typeof registrationSchema>;
export type IncidentFormData = z.infer<typeof incidentSchema>;
export type ExpenseFormData = z.infer<typeof expenseSchema>;