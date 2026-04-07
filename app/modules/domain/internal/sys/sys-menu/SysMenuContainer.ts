import { SysMenus } from '~/modules/data/internal/data-source/SysMenus';
import { SysMenuRepositoryImpl } from '~/modules/data/internal/repository/SysMenuRepositoryImpl';
import { container } from 'tsyringe';
import {
  SysMenuCOnesUseCase,
  SysMenuFManysUseCase,
  SysMenuFOnesTreeUseCase,
  SysMenuFOnesUseCase,
  SysMenuRemOnesUseCase,
  SysMenuRepManysUseCase,
  SysMenuUOnesUseCase,
} from './usecase';

export const sysMenuContainer = container.createChildContainer();

//#region Container HttpClient
sysMenuContainer.register('SysMenus', {
  useClass: SysMenus,
});
//#endregion Container HttpClient

//#region Container RepositoryImpl
sysMenuContainer.register('SysMenuRepository', {
  useClass: SysMenuRepositoryImpl,
});
//#endregion Container RepositoryImpl

//#region Container Usecase
sysMenuContainer.register('SysMenuCOnesUseCase', {
  useClass: SysMenuCOnesUseCase,
});

sysMenuContainer.register('SysMenuFManysUseCase', {
  useClass: SysMenuFManysUseCase,
});

sysMenuContainer.register('SysMenuFOnesTreeUseCase', {
  useClass: SysMenuFOnesTreeUseCase,
});

sysMenuContainer.register('SysMenuFOnesUseCase', {
  useClass: SysMenuFOnesUseCase,
});

sysMenuContainer.register('SysMenuRemOnesUseCase', {
  useClass: SysMenuRemOnesUseCase,
});

sysMenuContainer.register('SysMenuRepManysUseCase', {
  useClass: SysMenuRepManysUseCase,
});

sysMenuContainer.register('SysMenuUOnesUseCase', {
  useClass: SysMenuUOnesUseCase,
});
//#endregion Container Usecase
