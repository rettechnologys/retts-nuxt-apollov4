import { SysUsers } from '~/modules/data/internal/data-source/SysUsers';
import { SysUserRepositoryImpl } from '~/modules/data/internal/repository/SysUserRepositoryImpl';
import { container } from 'tsyringe';
import {
  SysUserCManysUseCase,
  SysUserCOnesUseCase,
  SysUserFManysUseCase,
  SysUserFOnesUseCase,
  SysUserRecOnesUseCase,
  SysUserRemManysUseCase,
  SysUserRemOnesUseCase,
  SysUserRepManysUseCase,
  SysUserRepOnesUseCase,
  SysUserUManysUseCase,
  SysUserUOnesUseCase,
} from './usecase';

export const sysUserContainer = container.createChildContainer();

//#region Container HttpClient
sysUserContainer.register('SysUsers', {
  useClass: SysUsers,
});
//#endregion Container HttpClient

//#region Container RepositoryImpl
sysUserContainer.register('SysUserRepository', {
  useClass: SysUserRepositoryImpl,
});
//#endregion Container RepositoryImpl

//#region Container Usecase
sysUserContainer.register('SysUserCManysUseCase', {
  useClass: SysUserCManysUseCase,
});

sysUserContainer.register('SysUserCOnesUseCase', {
  useClass: SysUserCOnesUseCase,
});

sysUserContainer.register('SysUserFManysUseCase', {
  useClass: SysUserFManysUseCase,
});

sysUserContainer.register('SysUserFOnesUseCase', {
  useClass: SysUserFOnesUseCase,
});

sysUserContainer.register('SysUserRecOnesUseCase', {
  useClass: SysUserRecOnesUseCase,
});

sysUserContainer.register('SysUserRemManysUseCase', {
  useClass: SysUserRemManysUseCase,
});

sysUserContainer.register('SysUserRemOnesUseCase', {
  useClass: SysUserRemOnesUseCase,
});

sysUserContainer.register('SysUserRepManysUseCase', {
  useClass: SysUserRepManysUseCase,
});

sysUserContainer.register('SysUserRepOnesUseCase', {
  useClass: SysUserRepOnesUseCase,
});

sysUserContainer.register('SysUserUManysUseCase', {
  useClass: SysUserUManysUseCase,
});

sysUserContainer.register('SysUserUOnesUseCase', {
  useClass: SysUserUOnesUseCase,
});
//#endregion Container Usecase
