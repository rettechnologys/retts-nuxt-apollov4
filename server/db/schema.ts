import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const site_config = sqliteTable('site_config', {
  id: integer('id').primaryKey(),
  site: text('site'),
  footer: text('footer'),
  updated_at: text('updated_at'),
});

export const pages = sqliteTable('pages', {
  slug: text('slug').primaryKey(),
  title: text('title'),
  status: text('status'),
  type: text('type'),
  payload: text('payload'),
  page_config: text('page_config'),
  settings: text('settings'),
  published_at: text('published_at'),
  scheduled_at: text('scheduled_at'),
  saved_at: text('saved_at'),
  created_at: text('created_at'),
});

export const collections = sqliteTable('collections', {
  slug: text('slug').primaryKey(),
  name: text('name'),
  icon: text('icon'),
  description: text('description'),
  schema: text('schema'),
  created_at: text('created_at'),
  updated_at: text('updated_at'),
});

export const collection_items = sqliteTable('collection_items', {
  id: text('id').primaryKey(),
  collection_slug: text('collection_slug'),
  data: text('data'),
  created_at: text('created_at'),
  updated_at: text('updated_at'),
});

export const timestampColumns = {
  created_at: text('created_at'),
  updated_at: text('updated_at'),
};
