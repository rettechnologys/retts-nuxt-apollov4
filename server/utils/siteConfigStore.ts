/**
 * DB-backed site config store
 * Persists the site + footer config into SQLite `site_config` table.
 */

import type { FooterConfig, SiteInfo } from '~~/shared';
import { drizzleDb } from '../db/client';
import { site_config } from '../db/schema';
import { eq } from 'drizzle-orm';

export interface StoredSiteConfig {
  footer: FooterConfig;
  site: SiteInfo;
}

const DEFAULT_SITE_CONFIG: StoredSiteConfig = {
  site: {
    name: 'My Site',
    logoUrl: undefined,
    tagline: undefined,
  },
  footer: {
    layout: 'columns',
    columns: 4,
    showSocial: true,
    showNewsletter: false,
    copyright: `© ${new Date().getFullYear()} Your Company. All rights reserved.`,
    columnData: [],
    socialLinks: [],
  },
};

export const getSiteConfig = async (): Promise<StoredSiteConfig> => {
  try {
    const rows = await drizzleDb
      .select()
      .from(site_config)
      .where(eq(site_config.id, 1));
    const row = rows && rows.length > 0 ? rows[0] : undefined;
    if (!row) return JSON.parse(JSON.stringify(DEFAULT_SITE_CONFIG));
    const site = row.site ? JSON.parse(row.site) : DEFAULT_SITE_CONFIG.site;
    const footer = row.footer
      ? JSON.parse(row.footer)
      : DEFAULT_SITE_CONFIG.footer;
    return { site, footer };
  } catch (err) {
    // If DB is not available, fall back to defaults
    // eslint-disable-next-line no-console
    console.error('getSiteConfig DB error:', err);
    return JSON.parse(JSON.stringify(DEFAULT_SITE_CONFIG));
  }
};

export const setSiteConfig = async (
  data: Partial<StoredSiteConfig>,
): Promise<StoredSiteConfig> => {
  const current = await getSiteConfig();
  const site = data.site ? { ...current.site, ...data.site } : current.site;
  const footer = data.footer
    ? { ...current.footer, ...data.footer }
    : current.footer;

  try {
    const now = new Date().toISOString();
    await drizzleDb
      .insert(site_config)
      .values({
        id: 1,
        site: JSON.stringify(site),
        footer: JSON.stringify(footer),
        updated_at: now,
      })
      .onConflictDoUpdate({
        target: site_config.id,
        set: {
          site: JSON.stringify(site),
          footer: JSON.stringify(footer),
          updated_at: now,
        },
      });

    return { site, footer };
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('setSiteConfig DB error:', err);
    return { site: current.site, footer: current.footer };
  }
};
