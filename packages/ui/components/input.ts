import { escapeHtml } from '../utils/escape';

export interface InputProps {
  id: string;
  placeholder?: string;
  value?: string;
  type?: 'text' | 'email' | 'password';
}

export function Input({ id, placeholder = '', value = '', type = 'text' }: InputProps) {
  return `<input
    id="${escapeHtml(id)}"
    type="${type}"
    class="input"
    placeholder="${escapeHtml(placeholder)}"
    value="${escapeHtml(value)}"
  />`;
}
