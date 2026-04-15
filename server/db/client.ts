import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';
import { drizzle as createDrizzle } from 'drizzle-orm/better-sqlite3';

// Use runtime-config or fallback to ./data/dev.db
const DB_FILE =
  process.env.DB_FILE || path.join(process.cwd(), 'data', 'dev.db');
fs.mkdirSync(path.dirname(DB_FILE), { recursive: true });

let sqlite: any | undefined;
let drizzleDbInstance: any | undefined;

try {
  sqlite = new Database(DB_FILE);

  // Initialize minimal tables used so far
  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS site_config (
      id INTEGER PRIMARY KEY,
      site TEXT,
      footer TEXT,
      updated_at TEXT
    );

    CREATE TABLE IF NOT EXISTS pages (
      slug TEXT PRIMARY KEY,
      title TEXT,
      status TEXT,
      type TEXT,
      payload TEXT,
      page_config TEXT,
      settings TEXT,
      published_at TEXT,
      scheduled_at TEXT,
      saved_at TEXT,
      created_at TEXT
    );
  `);

  // Ensure there's a default site_config row
  try {
    const row = sqlite
      .prepare('SELECT COUNT(1) as c FROM site_config WHERE id = 1')
      .get() as { c?: number } | undefined;
    if (!row || row.c === 0) {
      const defaultSite = JSON.stringify({ name: 'My Site' });
      const defaultFooter = JSON.stringify({
        layout: 'columns',
        columns: 4,
        showSocial: true,
        showNewsletter: false,
        copyright: `© ${new Date().getFullYear()} Your Company. All rights reserved.`,
        columnData: [],
        socialLinks: [],
      });
      sqlite
        .prepare(
          'INSERT INTO site_config (id, site, footer, updated_at) VALUES (1, ?, ?, ?)',
        )
        .run(defaultSite, defaultFooter, new Date().toISOString());
    }
  } catch (err) {
    // ignore initialization errors for now
    // consumer code should handle runtime errors when DB is not available
    // eslint-disable-next-line no-console
    console.error('SQLite initialization error:', err);
  }

  try {
    drizzleDbInstance = createDrizzle({ client: sqlite });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Drizzle initialization error:', err);
  }
} catch (err) {
  // eslint-disable-next-line no-console
  console.error('Failed to initialize SQLite client:', err);
}

// Backwards compatible export: `db` is the raw better-sqlite3 Database instance
export const db = sqlite as any;
// New Drizzle instance for typed queries
export const drizzleDb = drizzleDbInstance as any;
// Keep default export as raw sqlite for existing code compatibility
export default db;
