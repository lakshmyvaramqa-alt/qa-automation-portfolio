const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');
require('dotenv').config();

let activeClient = null;
let clientType = 'unknown';

async function initDatabase() {
  if (activeClient) return { client: activeClient, type: clientType };

  const dbHost = process.env.DB_HOST || 'localhost';
  const dbPort = parseInt(process.env.DB_PORT || '5432', 10);
  const dbUser = process.env.DB_USER || 'postgres';
  const dbPassword = process.env.DB_PASSWORD || 'postgres';
  const dbName = process.env.DB_NAME || 'pagila';
  const forceMode = process.env.DB_MODE || 'auto';

  // If not forcing embedded mode, attempt connection to PostgreSQL server (Docker / local)
  if (forceMode !== 'embedded') {
    try {
      const pool = new Pool({
        host: dbHost,
        port: dbPort,
        user: dbUser,
        password: dbPassword,
        database: dbName,
        connectionTimeoutMillis: 2000,
      });

      // Probe connection
      const res = await pool.query('SELECT version();');
      activeClient = {
        query: async (text, params) => {
          const result = await pool.query(text, params);
          return { rows: result.rows, rowCount: result.rowCount };
        },
        end: async () => pool.end(),
      };
      clientType = 'Docker / External PostgreSQL';
      return { client: activeClient, type: clientType, version: res.rows[0].version };
    } catch (err) {
      if (forceMode === 'docker') {
        throw new Error(`Failed to connect to Docker/External Postgres at ${dbHost}:${dbPort} (${err.message}).`);
      }
      // Otherwise fall through to embedded PGlite
    }
  }

  // Fallback / standalone mode: Embedded PostgreSQL 16 via PGlite
  const { PGlite } = require('@electric-sql/pglite');
  const pglite = new PGlite();

  // Load schema and seed data into in-memory PostgreSQL 16
  const schemaPath = path.join(__dirname, '..', 'sql', '00-init', '01-schema.sql');
  const seedPath = path.join(__dirname, '..', 'sql', '00-init', '02-seed-data.sql');

  const schemaSql = fs.readFileSync(schemaPath, 'utf8');
  const seedSql = fs.readFileSync(seedPath, 'utf8');

  await pglite.exec(schemaSql);
  await pglite.exec(seedSql);

  activeClient = {
    query: async (text) => {
      const result = await pglite.query(text);
      return { rows: result.rows, rowCount: result.rows ? result.rows.length : 0 };
    },
    exec: async (text) => {
      await pglite.exec(text);
    },
    end: async () => {},
  };
  clientType = 'Embedded PostgreSQL 16 (PGlite in-memory engine)';
  return { client: activeClient, type: clientType, version: 'PostgreSQL 16.2 (PGlite WebAssembly)' };
}

module.exports = { initDatabase };
