import { getSiteConfig } from '../utils/siteConfigStore';
import { buildNavigation } from '../utils/buildNavigation';
import type { SiteConfig } from '~~/shared';

export default defineEventHandler(async (): Promise<SiteConfig> => {
  const { footer, site } = await getSiteConfig();
  console.log('GET site config'); // Debug log
  console.log({ footer, site });
  return {
    navigation: await buildNavigation(),
    footer,
    site,
  };
});
