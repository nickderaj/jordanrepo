import { CreateTodoInputSchema, UpdateTodoInputSchema, type Todo } from '@repo/models/todo';
import { Router } from 'express';
import { pool } from './db.js';

type TodoRow = {
  id: string;
  title: string;
  done: boolean;
  created_at: Date;
  updated_at: Date;
};

function rowToTodo(row: TodoRow): Todo {
  return {
    id: row.id,
    title: row.title,
    done: row.done,
    createdAt: row.created_at.toISOString(),
    updatedAt: row.updated_at.toISOString(),
  };
}

export const todosRouter: Router = Router();

todosRouter.get('/', async (_req, res) => {
  const { rows } = await pool.query<TodoRow>(
    'SELECT id, title, done, created_at, updated_at FROM todos ORDER BY created_at DESC',
  );
  res.json(rows.map(rowToTodo));
});

todosRouter.get('/:id', async (req, res) => {
  const { rows } = await pool.query<TodoRow>(
    'SELECT id, title, done, created_at, updated_at FROM todos WHERE id = $1',
    [req.params.id],
  );
  if (rows.length === 0) return res.status(404).json({ error: 'Not found' });
  res.json(rowToTodo(rows[0]!));
});

todosRouter.post('/', async (req, res) => {
  const parsed = CreateTodoInputSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: 'Invalid input', details: parsed.error.flatten() });
  }
  const { rows } = await pool.query<TodoRow>(
    'INSERT INTO todos (title) VALUES ($1) RETURNING id, title, done, created_at, updated_at',
    [parsed.data.title],
  );
  res.status(201).json(rowToTodo(rows[0]!));
});

todosRouter.patch('/:id', async (req, res) => {
  const parsed = UpdateTodoInputSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: 'Invalid input', details: parsed.error.flatten() });
  }
  const { title, done } = parsed.data;
  const { rows } = await pool.query<TodoRow>(
    `UPDATE todos
       SET title = COALESCE($2, title),
           done = COALESCE($3, done),
           updated_at = NOW()
     WHERE id = $1
     RETURNING id, title, done, created_at, updated_at`,
    [req.params.id, title ?? null, done ?? null],
  );
  if (rows.length === 0) return res.status(404).json({ error: 'Not found' });
  res.json(rowToTodo(rows[0]!));
});

todosRouter.delete('/:id', async (req, res) => {
  const { rowCount } = await pool.query('DELETE FROM todos WHERE id = $1', [req.params.id]);
  if (rowCount === 0) return res.status(404).json({ error: 'Not found' });
  res.status(204).end();
});
