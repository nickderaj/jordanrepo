import { Button } from '@repo/ui/button';
import { Header } from '@repo/ui/header';
import { Input } from '@repo/ui/input';
import { TodoItem } from '@repo/ui/todo-item';
import type { Todo } from '@repo/models/todo';
import { api } from './api';
import './style.css';

const app = document.querySelector<HTMLDivElement>('#app')!;

app.innerHTML = `
  ${Header({ title: 'Todos' })}
  <form id="new-todo-form" class="toolbar">
    ${Input({ id: 'new-todo-input', placeholder: 'What needs doing?' })}
    ${Button({ label: 'Add', type: 'submit' })}
    ${Button({ label: 'Refresh', id: 'refresh-btn', variant: 'secondary' })}
  </form>
  <ul id="todo-list" class="todo-list"></ul>
  <p id="status" class="status"></p>
`;

const listEl = document.querySelector<HTMLUListElement>('#todo-list')!;
const formEl = document.querySelector<HTMLFormElement>('#new-todo-form')!;
const inputEl = document.querySelector<HTMLInputElement>('#new-todo-input')!;
const refreshEl = document.querySelector<HTMLButtonElement>('#refresh-btn')!;
const statusEl = document.querySelector<HTMLParagraphElement>('#status')!;

function setStatus(message: string, isError = false) {
  statusEl.textContent = message;
  statusEl.classList.toggle('error', isError);
}

function render(todos: Todo[]) {
  listEl.innerHTML = todos.map(TodoItem).join('');
  setStatus(`${todos.length} todo${todos.length === 1 ? '' : 's'}`);
}

async function refresh() {
  try {
    render(await api.list());
  } catch (err) {
    setStatus(`Failed to load: ${(err as Error).message}`, true);
  }
}

formEl.addEventListener('submit', async (e) => {
  e.preventDefault();
  const title = inputEl.value.trim();
  if (!title) return;
  try {
    await api.create({ title });
    inputEl.value = '';
    await refresh();
  } catch (err) {
    setStatus(`Create failed: ${(err as Error).message}`, true);
  }
});

refreshEl.addEventListener('click', refresh);

listEl.addEventListener('change', async (e) => {
  const target = e.target as HTMLInputElement;
  if (!target.classList.contains('todo-toggle')) return;
  const id = target.dataset.id!;
  try {
    await api.update(id, { done: target.checked });
    await refresh();
  } catch (err) {
    setStatus(`Update failed: ${(err as Error).message}`, true);
  }
});

listEl.addEventListener('click', async (e) => {
  const target = (e.target as HTMLElement).closest<HTMLButtonElement>("button[data-action='delete']");
  if (!target) return;
  const id = target.dataset.id!;
  try {
    await api.remove(id);
    await refresh();
  } catch (err) {
    setStatus(`Delete failed: ${(err as Error).message}`, true);
  }
});

refresh();
