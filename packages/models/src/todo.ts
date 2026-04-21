import { z } from 'zod';

export const TodoSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1).max(200),
  done: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const CreateTodoInputSchema = z.object({
  title: z.string().min(1).max(200),
});

export const UpdateTodoInputSchema = z
  .object({
    title: z.string().min(1).max(200).optional(),
    done: z.boolean().optional(),
  })
  .refine((v) => v.title !== undefined || v.done !== undefined, {
    message: 'At least one of `title` or `done` must be provided',
  });

export type Todo = z.infer<typeof TodoSchema>;
export type CreateTodoInput = z.infer<typeof CreateTodoInputSchema>;
export type UpdateTodoInput = z.infer<typeof UpdateTodoInputSchema>;
