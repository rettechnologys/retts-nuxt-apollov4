import { sysNotifCategoryContainer } from '../SysNotifCategoryContainer';
import { SysNotifCategoryFManysUseCase, SysNotifCategoryFOnesUseCase } from '.';

function instanceSysNotifCategoryFManysUseCase(): SysNotifCategoryFManysUseCase {
  return sysNotifCategoryContainer.resolve(SysNotifCategoryFManysUseCase);
}

function instanceSysNotifCategoryFOnesUseCase(): SysNotifCategoryFOnesUseCase {
  return sysNotifCategoryContainer.resolve(SysNotifCategoryFOnesUseCase);
}

export const sysNotifCategoryUseCaseResolver = {
  instanceSysNotifCategoryFManysUseCase,
  instanceSysNotifCategoryFOnesUseCase,
};
