import { z } from 'zod';

export const createRecord = z.object({
  body: z.object({
    amount: z.number().positive(),
    type: z.enum(['INCOME', 'EXPENSE']),
    category: z.string().min(2),
    date: z.string().datetime(),
    notes: z.string().optional()
  }),
  query: z.object({}),
  params: z.object({})
});

export const getRecordsParams = z.object({
  body: z.object({}),
  query: z.object({
    type: z.enum(['INCOME', 'EXPENSE']).optional(),
    category: z.string().optional(),
    startDate: z.string().datetime().optional(),
    endDate: z.string().datetime().optional(),
    search: z.string().optional(),
    page: z.string().optional(),
    limit: z.string().optional(),
  }),
  params: z.object({})
});

export const updateRecord = z.object({
  body: z.object({
    amount: z.number().positive().optional(),
    type: z.enum(['INCOME', 'EXPENSE']).optional(),
    category: z.string().min(2).optional(),
    date: z.string().datetime().optional(),
    notes: z.string().optional()
  }),
  query: z.object({}),
  params: z.object({ id: z.string().uuid() })
});
