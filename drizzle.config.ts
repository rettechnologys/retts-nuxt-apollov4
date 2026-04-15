import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './server/db/schema.ts',
  out: './server/db/migrations',
  // sqlite dialect
  dialect: 'sqlite',
  dbCredentials: {
    // path to the file used in the project
    url: './data/dev.db',
  },
  // keep migrations output verbose for visibility
  verbose: true,
});
