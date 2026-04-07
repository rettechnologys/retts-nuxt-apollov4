import { SysNotifCategoryRepositoryImpl } from '~/modules/data/internal/repository/SysNotifCategoryRepositoryImpl';
import { container } from 'tsyringe';
import {
  SysNotifCategoryCOnesUseCase,
  SysNotifCategoryFManysUseCase,
  SysNotifCategoryFOnesUseCase,
  SysNotifCategoryRecOnesUseCase,
  SysNotifCategoryRemManysUseCase,
  SysNotifCategoryRemOnesUseCase,
  SysNotifCategoryUOnesUseCase,
} from './usecase';
import { SysNotifsCategories } from '~/modules/data/internal/data-source/SysNotifsCategories';

export const sysNotifCategoryContainer = container.createChildContainer();

//#region Container HttpClient
sysNotifCategoryContainer.register('SysNotifsCategories', {
  useClass: SysNotifsCategories,
});
//#endregion Container HttpClient

//#region Container RepositoryImpl
sysNotifCategoryContainer.register('SysNotifCategoryRepository', {
  useClass: SysNotifCategoryRepositoryImpl,
});
//#endregion Container RepositoryImpl

//#region Container Usecase
sysNotifCategoryContainer.register('SysNotifCategoryCOnesUseCase', {
  useClass: SysNotifCategoryCOnesUseCase,
});

sysNotifCategoryContainer.register('SysNotifCategoryFManysUseCase', {
  useClass: SysNotifCategoryFManysUseCase,
});

sysNotifCategoryContainer.register('SysNotifCategoryFOnesUseCase', {
  useClass: SysNotifCategoryFOnesUseCase,
});

sysNotifCategoryContainer.register('SysNotifCategoryRecOnesUseCase', {
  useClass: SysNotifCategoryRecOnesUseCase,
});

sysNotifCategoryContainer.register('SysNotifCategoryRemManysUseCase', {
  useClass: SysNotifCategoryRemManysUseCase,
});

sysNotifCategoryContainer.register('SysNotifCategoryRemOnesUseCase', {
  useClass: SysNotifCategoryRemOnesUseCase,
});

sysNotifCategoryContainer.register('SysNotifCategoryUOnesUseCase', {
  useClass: SysNotifCategoryUOnesUseCase,
});
//#endregion Container Usecase
