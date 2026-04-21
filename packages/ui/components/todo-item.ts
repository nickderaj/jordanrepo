import { escapeHtml } from '../utils/escape';
import { Button } from './button';

export interface TodoItemProps {
  id: string;
  title: string;
  done: boolean;
}

export function TodoItem({ id, title, done }: TodoItemProps) {
  return `<li class="todo-item ${done ? 'todo-done' : ''}" data-id="${escapeHtml(id)}">
    <label class="todo-label">
      <input type="checkbox" class="todo-toggle" data-id="${escapeHtml(id)}" ${done ? 'checked' : ''} />
      <span class="todo-title">${escapeHtml(title)}</span>
    </label>
    ${Button({ label: 'Delete', variant: 'danger', dataset: { action: 'delete', id } })}
  </li>`;
}
