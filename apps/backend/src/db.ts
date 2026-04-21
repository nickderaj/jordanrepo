import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import pg from 'pg';

const { Pool } = pg;

const connectionString = process.env.DATABASE_URL ?? 'postgres://jordan:jordan@localhost:5432/jordan';

export const pool = new Pool({ connectionString });

export async function runMigrations() {
  const here = dirname(fileURLToPath(import.meta.url));
  const sql = readFileSync(resolve(here, 'schema.sql'), 'utf8');
  await pool.query(sql);
}
