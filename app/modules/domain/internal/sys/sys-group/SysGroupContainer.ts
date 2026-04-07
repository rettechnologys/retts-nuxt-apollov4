import { SysGroups } from '~/modules/data/internal/data-source/SysGroups';
import { SysGroupRepositoryImpl } from '~/modules/data/internal/repository/SysGroupRepositoryImpl';
import { container } from 'tsyringe';
import {
  SysGroupCManysUseCase,
  SysGroupCOnesUseCase,
  SysGroupFManysParentUseCase,
  SysGroupFManysUseCase,
  SysGroupFOnesUseCase,
  SysGroupRecOnesUseCase,
  SysGroupRemManysUseCase,
  SysGroupRemOnesUseCase,
  SysGroupRepManysUseCase,
  SysGroupRepOnesUseCase,
  SysGroupUManysUseCase,
  SysGroupUOnesUseCase,
} from './usecase';

export const sysGroupContainer = container.createChildContainer();

//#region Container HttpClient
sysGroupContainer.register('SysGroups', {
  useClass: SysGroups,
});
//#endregion Container HttpClient

//#region Container RepositoryImpl
sysGroupContainer.register('SysGroupRepository', {
  useClass: SysGroupRepositoryImpl,
});
//#endregion Container RepositoryImpl

//#region Container Usecase
sysGroupContainer.register('SysGroupCManysUseCase', {
  useClass: SysGroupCManysUseCase,
});

sysGroupContainer.register('SysGroupCOnesUseCase', {
  useClass: SysGroupCOnesUseCase,
});

sysGroupContainer.register('SysGroupFManysParentUseCase', {
  useClass: SysGroupFManysParentUseCase,
});

sysGroupContainer.register('SysGroupFManysUseCase', {
  useClass: SysGroupFManysUseCase,
});

sysGroupContainer.register('SysGroupFOnesUseCase', {
  useClass: SysGroupFOnesUseCase,
});

sysGroupContainer.register('SysGroupRecOnesUseCase', {
  useClass: SysGroupRecOnesUseCase,
});

sysGroupContainer.register('SysGroupRemManysUseCase', {
  useClass: SysGroupRemManysUseCase,
});

sysGroupContainer.register('SysGroupRemOnesUseCase', {
  useClass: SysGroupRemOnesUseCase,
});

sysGroupContainer.register('SysGroupRepManysUseCase', {
  useClass: SysGroupRepManysUseCase,
});

sysGroupContainer.register('SysGroupRepOnesUseCase', {
  useClass: SysGroupRepOnesUseCase,
});

sysGroupContainer.register('SysGroupUManysUseCase', {
  useClass: SysGroupUManysUseCase,
});

sysGroupContainer.register('SysGroupUOnesUseCase', {
  useClass: SysGroupUOnesUseCase,
});
//#endregion Container Usecase
