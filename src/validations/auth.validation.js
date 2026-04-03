import { z } from 'zod';

export const register = z.object({
  body: z.object({
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(6),
    role: z.enum(['ADMIN', 'ANALYST', 'VIEWER']).optional()
  }),
  query: z.object({}),
  params: z.object({})
});

export const login = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string()
  }),
  query: z.object({}),
  params: z.object({})
});
