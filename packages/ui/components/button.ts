import { escapeHtml } from '../utils/escape';

export type ButtonVariant = 'primary' | 'secondary' | 'danger';

export interface ButtonProps {
  label: string;
  id?: string;
  variant?: ButtonVariant;
  type?: 'button' | 'submit';
  dataset?: Record<string, string>;
}

export function Button({ label, id, variant = 'primary', type = 'button', dataset = {} }: ButtonProps) {
  const data = Object.entries(dataset)
    .map(([k, v]) => `data-${k}="${escapeHtml(v)}"`)
    .join(' ');
  return `<button
    ${id ? `id="${escapeHtml(id)}"` : ''}
    type="${type}"
    class="btn btn-${variant}"
    ${data}
  >${escapeHtml(label)}</button>`;
}
