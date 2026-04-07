import { SysConfigs } from '~/modules/data/internal/data-source/SysConfigs';
import { SysConfigRepositoryImpl } from '~/modules/data/internal/repository/SysConfigRepositoryImpl';
import { container } from 'tsyringe';
import {
  SysConfigCUManysUseCase,
  SysConfigCUOnesUseCase,
  SysConfigFManysUseCase,
  SysConfigFOnesUseCase,
  SysConfigRemManysUseCase,
  SysConfigRemOnesUseCase,
} from './usecase';

export const sysConfigContainer = container.createChildContainer();

//#region Container HttpClient
sysConfigContainer.register('SysConfigs', {
  useClass: SysConfigs,
});
//#endregion Container HttpClient

//#region Container RepositoryImpl
sysConfigContainer.register('SysConfigRepository', {
  useClass: SysConfigRepositoryImpl,
});
//#endregion Container RepositoryImpl

//#region Container Usecase
sysConfigContainer.register('SysConfigCUManysUseCase', {
  useClass: SysConfigCUManysUseCase,
});

sysConfigContainer.register('SysConfigCUOnesUseCase', {
  useClass: SysConfigCUOnesUseCase,
});

sysConfigContainer.register('SysConfigFManysUseCase', {
  useClass: SysConfigFManysUseCase,
});

sysConfigContainer.register('SysConfigFOnesUseCase', {
  useClass: SysConfigFOnesUseCase,
});

sysConfigContainer.register('SysConfigRemManysUseCase', {
  useClass: SysConfigRemManysUseCase,
});

sysConfigContainer.register('SysConfigRemOnesUseCase', {
  useClass: SysConfigRemOnesUseCase,
});
//#endregion Container Usecase
