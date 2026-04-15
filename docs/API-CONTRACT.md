# API Contract — retts-nuxt-apollov4

Date: 2026-04-15

## Overview

This document describes the HTTP API surface used by the frontend and the admin UI. The implementation uses a local SQLite database (default file: `data/dev.db`) with Drizzle ORM for typed queries. Endpoints live under `/api/*` and are implemented as Nuxt/H3 server handlers.

Common rules:

- Base URL: `http://localhost:3000` (adjust for your environment / `nuxt dev` port).
- Content types: `application/json` for JSON payloads; endpoints that accept uploads support `multipart/form-data` where files are converted to data-URL strings.
- Persistence: pages and site-config use upsert semantics (INSERT ... ON CONFLICT DO UPDATE). Collections and collection items are persisted to `collections` and `collection_items` tables.
- Files: file parts are converted to data URLs and stored as string fields inside the JSON payload.

Refer to the DB schema: `server/db/schema.ts` for column names and types.

---

## Endpoints

All examples use `http://localhost:3000` — replace as needed.

**Pages**

- GET `/api/pages/[...slug]`
  - Description: Retrieve a page by slug (catch-all route). Returns a single page object containing `id`, `slug`, `payload`, optional `page_config`, `published`, and timestamps.
  - Response 200 example:

```json
{
  "id": "home",
  "slug": "home",
  "payload": {"blocks": [...]},
  "page_config": {"title": "Home"},
  "published": true,
  "created_at": "2026-04-15T10:00:00Z",
  "updated_at": "2026-04-15T10:05:00Z"
}
```

- Curl example:

```bash
curl -sS http://localhost:3000/api/pages/home
```

- POST `/api/pages/[...slug]`
  - Description: Create or update a page. Accepts `application/json` or `multipart/form-data` (for uploads).
  - Body (JSON) example:

```json
{
  "id": "home",
  "payload": {"blocks": [{"type":"hero","data":{...}}]},
  "page_config": {"title":"Home"},
  "published": true
}
```

- Multipart/file uploads: include file parts; the server converts files to data URLs and embeds them into the payload where expected.

- Response 200 example:

```json
{
  "ok": true,
  "page": {
    /* saved page object */
  }
}
```

- Curl example (JSON):

```bash
curl -X POST http://localhost:3000/api/pages/home \
  -H 'Content-Type: application/json' \
  -d '{"id":"home","payload":{"blocks":[]},"page_config":{"title":"Home"},"published":true}'
```

**Collections (schema)**

- GET `/api/collections`
  - List all collection schemas.
- GET `/api/collections/:slug`
  - Get a single collection schema by slug.
- PUT `/api/collections/:slug`
  - Create or update collection schema. Body is JSON describing fields and metadata.
  - Example body:

```json
{
  "slug": "posts",
  "title": "Posts",
  "fields": [
    { "name": "title", "type": "string" },
    { "name": "body", "type": "richtext" }
  ]
}
```

- DELETE `/api/collections/:slug`
  - Delete a collection schema and (optionally) its items.

**Collection Items**

- GET `/api/collections/:slug/items`
  - Return all items for the collection (or page through results as needed).

- GET `/api/collections/:slug/items/:id`
  - Return a single item by id.

- POST `/api/collections/:slug/items`
  - Create a new item in the collection. Preferred request: `application/json` with the full item payload.
  - Recommended body:

```json
{
  "id": "optional-client-id-or-server-generated",
  "data": { "title": "My Post", "body": "..." },
  "meta": { "status": "draft" }
}
```

- The server will persist the item to the `collection_items` table. If `id` is omitted, the backend will generate a unique id.

- PUT `/api/collections/:slug/items/:id`
  - Update an existing item by id. Body is the item JSON.

- DELETE `/api/collections/:slug/items/:id`
  - Remove an item from the collection.

Response example for a created item:

```json
{
  "ok": true,
  "item": {
    "id": "abc123",
    "collection_slug": "posts",
    "data": { "title": "My Post", "body": "..." },
    "created_at": "2026-04-15T10:10:00Z",
    "updated_at": "2026-04-15T10:10:00Z"
  }
}
```

**Site config**

- GET `/api/site-config`
  - Returns the global site config (single row, id=1 in the DB).

- POST `/api/site-config` (or PUT)
  - Upserts the site config. Body: JSON object with site settings (title, footer, social links, etc.).

Example:

```json
{
  "title": "My Site",
  "navigation": [{ "label": "Home", "href": "/" }],
  "footer": { "copyright": "© 2026" }
}
```

Response: the saved site-config JSON and metadata.

---

## Error handling & status codes

- 200: success
- 400: malformed request / validation errors
- 404: resource not found
- 500: server error

Error responses are JSON objects with an `error` message and optional `details`.

---

## DB & implementation notes for backend team

- DB file (dev): `data/dev.db` (better-sqlite3 + Drizzle ORM). Production may use another DB.
- Key tables: `pages`, `site_config`, `collections`, `collection_items`.
- Pages and site-config use upsert semantics to ensure single-row config and id-based pages are updated atomically.
- File parts are converted to data URLs and stored inside JSON payloads; if you want to migrate to object storage, update `server/utils/parseFormData.ts` and the upload handlers.

Files to inspect for server behavior:

- [server/db/schema.ts](server/db/schema.ts)
- [server/db/client.ts](server/db/client.ts)
- [server/api/pages/[...slug].get.ts](server/api/pages/[...slug].get.ts)
- [server/api/pages/[...slug].post.ts](server/api/pages/[...slug].post.ts)
- [server/utils/collectionStore.ts](server/utils/collectionStore.ts)
- [server/api/collections](server/api/collections)

---

## Smoke test checklist (quick)

1. Start dev server:

```bash
npm run dev
```

2. Pages: GET and POST a page

```bash
curl -X GET http://localhost:3000/api/pages/home

curl -X POST http://localhost:3000/api/pages/home \
  -H 'Content-Type: application/json' \
  -d '{"id":"home","payload":{"blocks":[]},"page_config":{"title":"Home"},"published":true}'
```

3. Collections: create schema, add item, read item

```bash
curl -X PUT http://localhost:3000/api/collections/posts \
  -H 'Content-Type: application/json' \
  -d '{"slug":"posts","title":"Posts","fields":[{"name":"title","type":"string"}]}'

curl -X POST http://localhost:3000/api/collections/posts/items \
  -H 'Content-Type: application/json' \
  -d '{"data":{"title":"Hello"}}'

curl http://localhost:3000/api/collections/posts/items
```

4. Site config: upsert and read

```bash
curl -X POST http://localhost:3000/api/site-config \
  -H 'Content-Type: application/json' \
  -d '{"title":"My Site","navigation":[]}'

curl http://localhost:3000/api/site-config
```

---

If you want, I can now run the smoke tests against a running dev server and capture real request/response examples into this document.
