import type { GlobalConfigs } from '~~/shared';
import { buildNavigation } from '../utils/buildNavigation';

export default defineEventHandler(async (): Promise<GlobalConfigs> => {
  return { menus: await buildNavigation() };
});
