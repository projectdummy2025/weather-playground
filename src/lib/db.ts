/**
 * Database connection untuk PostgreSQL
 * Menggunakan koneksi ke database adm4 dengan data wilayah Indonesia
 */

import { Pool, PoolClient } from 'pg';

// Database configuration dari environment atau default development
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'adm4',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'admin0123',
  max: 20, // Maximum number of connections
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Test connection on startup
pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

/**
 * Execute a query with automatic connection handling
 */
export async function query<T>(
  text: string,
  params?: (string | number | boolean | null)[]
): Promise<T[]> {
  const client = await pool.connect();
  try {
    const result = await client.query(text, params);
    return result.rows as T[];
  } finally {
    client.release();
  }
}

/**
 * Get a client for transaction support
 */
export async function getClient(): Promise<PoolClient> {
  return pool.connect();
}

/**
 * Close all connections (useful for cleanup)
 */
export async function closePool(): Promise<void> {
  await pool.end();
}

export default pool;
