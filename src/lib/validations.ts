import { z } from 'zod';

// Common validation patterns
const namePattern = /^[a-zA-Z\s'-]+$/;
const phonePattern = /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]*$/;

// Email validation schema
export const emailSchema = z
  .string()
  .trim()
  .min(1, { message: "Email is required" })
  .email({ message: "Please enter a valid email address" })
  .max(255, { message: "Email must be less than 255 characters" });

// Password validation schema with strength requirements
export const passwordSchema = z
  .string()
  .min(8, { message: "Password must be at least 8 characters" })
  .max(128, { message: "Password must be less than 128 characters" })
  .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
  .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
  .regex(/[0-9]/, { message: "Password must contain at least one number" })
  .regex(/[^A-Za-z0-9]/, { message: "Password must contain at least one special character" });

// Name validation schema
export const nameSchema = z
  .string()
  .trim()
  .min(2, { message: "Name must be at least 2 characters" })
  .max(50, { message: "Name must be less than 50 characters" })
  .regex(namePattern, { message: "Name can only contain letters, spaces, hyphens, and apostrophes" });

// Age validation schema
export const ageSchema = z
  .string()
  .refine((val) => {
    const num = parseInt(val, 10);
    return !isNaN(num) && num >= 5 && num <= 120;
  }, { message: "Age must be between 5 and 120 years" });

// Phone validation schema
export const phoneSchema = z
  .string()
  .trim()
  .regex(phonePattern, { message: "Please enter a valid phone number" })
  .optional()
  .or(z.literal(''));

// Sign In schema
export const signInSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, { message: "Password is required" }),
});

// Student Sign Up schema
export const studentSignUpSchema = z.object({
  firstName: nameSchema,
  lastName: nameSchema,
  email: emailSchema,
  age: ageSchema,
  password: passwordSchema,
  confirmPassword: z.string().min(1, { message: "Please confirm your password" }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

// Teacher Sign Up schema
export const teacherSignUpSchema = z.object({
  firstName: nameSchema,
  lastName: nameSchema,
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: z.string().min(1, { message: "Please confirm your password" }),
  subject: z.string().min(1, { message: "Teaching subject is required" }),
  experience: z.string().optional(),
  location: z.string().optional(),
  specialties: z.string().optional(),
  languages: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

// Admin Sign Up schema
export const adminSignUpSchema = z.object({
  firstName: nameSchema,
  lastName: nameSchema,
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: z.string().min(1, { message: "Please confirm your password" }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

// Password strength calculator
export const getPasswordStrength = (password: string): {
  score: number;
  label: string;
  color: string;
} => {
  let score = 0;
  
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  
  if (score <= 2) return { score, label: 'Weak', color: 'bg-red-500' };
  if (score <= 4) return { score, label: 'Medium', color: 'bg-yellow-500' };
  if (score <= 5) return { score, label: 'Strong', color: 'bg-green-500' };
  return { score, label: 'Very Strong', color: 'bg-emerald-500' };
};

// Format validation errors for display
export const formatValidationErrors = (error: z.ZodError): string[] => {
  return error.errors.map((err) => err.message);
};

// Validate and return first error or null
export const validateField = <T>(schema: z.ZodType<T>, value: unknown): string | null => {
  const result = schema.safeParse(value);
  if (!result.success) {
    return result.error.errors[0]?.message || 'Invalid value';
  }
  return null;
};

// Currency formatting for INR
export const formatINR = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

// Format price with rupee symbol
export const formatPrice = (price: number): string => {
  return `₹${price.toLocaleString('en-IN')}`;
};
