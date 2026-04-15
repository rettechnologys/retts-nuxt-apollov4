/**
 * Derives a Menu[] navigation tree from the in-memory page store.
 * Only published pages with settings.showInMenu === true are included.
 * Tree is built from path segments — nested pages become children of
 * their path parent (explicit or implicit).
 */

import type { Menu } from '~~/shared';
import { drizzleDb } from '../db/client';
import { pages } from '../db/schema';
import { eq } from 'drizzle-orm';

export const buildNavigation = async (): Promise<Menu[]> => {
  // Read published pages from DB and build the tree similar to previous in-memory logic.
  const rows = (await drizzleDb
    .select()
    .from(pages)
    .where(eq(pages.status, 'published'))) as Array<any>;

  const pagesList = rows
    .map((row) => {
      const payload = row.payload ? JSON.parse(row.payload) : {};
      const pageConfig = row.page_config ? JSON.parse(row.page_config) : {};
      return { payload, pageConfig };
    })
    .filter((entry) => entry.payload.settings?.showInMenu === true)
    .sort((a, b) => {
      const pathA: string = a.pageConfig?.path ?? `/${a.payload.slug}`;
      const pathB: string = b.pageConfig?.path ?? `/${b.payload.slug}`;
      const depthA = pathA.replace(/^\//, '').split('/').filter(Boolean).length;
      const depthB = pathB.replace(/^\//, '').split('/').filter(Boolean).length;
      if (depthA !== depthB) return depthA - depthB;
      return (
        (a.payload.settings?.menuOrder ?? 0) -
        (b.payload.settings?.menuOrder ?? 0)
      );
    });

  const root: Menu[] = [];
  const nodeMap = new Map<string, Menu>();

  for (const entry of pagesList) {
    const path: string =
      entry.pageConfig?.path ?? `/${entry.payload.slug ?? ''}`;
    const rawSegments = path.replace(/^\//, '').split('/').filter(Boolean);
    const segments =
      rawSegments.length > 0 ? rawSegments : [entry.payload.slug ?? 'home'];
    if (segments.length === 0) continue;

    const title: string = entry.payload.title ?? segments[segments.length - 1];

    const node: Menu = {
      name: segments[segments.length - 1],
      link: path,
      sysMenuLangs: [{ code: 'en', description: title }],
    };

    const nodeKey = segments.join('/');
    nodeMap.set(nodeKey, node);

    if (segments.length === 1) {
      root.push(node);
    } else {
      const parentKey = segments.slice(0, -1).join('/');
      const parent = nodeMap.get(parentKey);

      if (parent) {
        if (!parent.children) parent.children = [];
        parent.children.push(node);
      } else {
        const implicitParent: Menu = {
          name: segments[0],
          sysMenuLangs: [{ code: 'en', description: segments[0] }],
          children: [node],
        };
        root.push(implicitParent);
        nodeMap.set(segments[0], implicitParent);
      }
    }
  }

  return root;
};
