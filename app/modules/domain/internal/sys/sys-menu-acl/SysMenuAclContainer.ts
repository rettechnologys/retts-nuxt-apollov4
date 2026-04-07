import { SysMenusAcls } from '~/modules/data/internal/data-source/SysMenusAcls';
import { SysMenuAclRepositoryImpl } from '~/modules/data/internal/repository/SysMenuAclRepositoryImpl';
import { container } from 'tsyringe';
import {
  SysMenuAclFManysActionsUseCase,
  SysMenuAclFManysUseCase,
  SysMenuAclUOnesUseCase,
} from './usecase';

export const sysMenuAclContainer = container.createChildContainer();

//#region Container HttpClient
sysMenuAclContainer.register('SysMenusAcls', {
  useClass: SysMenusAcls,
});
//#endregion Container HttpClient

//#region Container RepositoryImpl
sysMenuAclContainer.register('SysMenuAclRepository', {
  useClass: SysMenuAclRepositoryImpl,
});
//#endregion Container RepositoryImpl

//#region Container Usecase
sysMenuAclContainer.register('SysMenuAclFManysActionsUseCase', {
  useClass: SysMenuAclFManysActionsUseCase,
});

sysMenuAclContainer.register('SysMenuAclFManysUseCase', {
  useClass: SysMenuAclFManysUseCase,
});

sysMenuAclContainer.register('SysMenuAclUOnesUseCase', {
  useClass: SysMenuAclUOnesUseCase,
});
//#endregion Container Usecase
