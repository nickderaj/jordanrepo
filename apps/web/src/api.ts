import type { CreateTodoInput, Todo, UpdateTodoInput } from '@repo/models/todo';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3001';

async function handle<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`${res.status} ${res.statusText}: ${body}`);
  }
  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

export const api = {
  list: () => fetch(`${API_URL}/todos`).then(handle<Todo[]>),
  create: (input: CreateTodoInput) =>
    fetch(`${API_URL}/todos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    }).then(handle<Todo>),
  update: (id: string, input: UpdateTodoInput) =>
    fetch(`${API_URL}/todos/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    }).then(handle<Todo>),
  remove: (id: string) => fetch(`${API_URL}/todos/${id}`, { method: 'DELETE' }).then(handle<void>),
};
