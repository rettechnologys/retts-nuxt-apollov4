import { getSiteConfig } from '../utils/siteConfigStore';

export default defineEventHandler(async () => {
  return await getSiteConfig();
});
