import { SysConfigsCategories } from '~/modules/data/internal/data-source/SysConfigsCategories';
import { SysConfigCategoryRepositoryImpl } from '~/modules/data/internal/repository/SysConfigCategoryImpl';
import { container } from 'tsyringe';
import {
  SysConfigCategoryCOnesUseCase,
  SysConfigCategoryFManysUseCase,
  SysConfigCategoryFOnesUseCase,
  SysConfigCategoryRecOnesUseCase,
  SysConfigCategoryRemManysUseCase,
  SysConfigCategoryRemOnesUseCase,
  SysConfigCategoryRepOnesUseCase,
  SysConfigCategoryUOnesUseCase,
} from './usecase';

export const sysConfigCategoryContainer = container.createChildContainer();

//#region Container HttpClient
sysConfigCategoryContainer.register('SysConfigsCategories', {
  useClass: SysConfigsCategories,
});
//#endregion Container HttpClient

//#region Container RepositoryImpl
sysConfigCategoryContainer.register('SysConfigCategoryRepository', {
  useClass: SysConfigCategoryRepositoryImpl,
});
//#endregion Container RepositoryImpl

//#region Container Usecase

sysConfigCategoryContainer.register('SysConfigCategoryCOnesUseCase', {
  useClass: SysConfigCategoryCOnesUseCase,
});

sysConfigCategoryContainer.register('SysConfigCategoryFManysUseCase', {
  useClass: SysConfigCategoryFManysUseCase,
});

sysConfigCategoryContainer.register('SysConfigCategoryFOnesUseCase', {
  useClass: SysConfigCategoryFOnesUseCase,
});

sysConfigCategoryContainer.register('SysConfigCategoryRecOnesUseCase', {
  useClass: SysConfigCategoryRecOnesUseCase,
});

sysConfigCategoryContainer.register('SysConfigCategoryRemManysUseCase', {
  useClass: SysConfigCategoryRemManysUseCase,
});

sysConfigCategoryContainer.register('SysConfigCategoryRemOnesUseCase', {
  useClass: SysConfigCategoryRemOnesUseCase,
});

sysConfigCategoryContainer.register('SysConfigCategoryRepOnesUseCase', {
  useClass: SysConfigCategoryRepOnesUseCase,
});

sysConfigCategoryContainer.register('SysConfigCategoryUOnesUseCase', {
  useClass: SysConfigCategoryUOnesUseCase,
});
//#endregion Container Usecase
