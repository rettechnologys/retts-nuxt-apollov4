import { SysSchedulers } from '~/modules/data/internal/data-source/SysSchedulers';
import { SysSchedulerRepositoryImpl } from '~/modules/data/internal/repository/SysSchedulerRepositoryImpl';
import { container } from 'tsyringe';
import {
  SysSchedulerCOnesUseCase,
  SysSchedulerFManysActiveUseCase,
  SysSchedulerFManysUseCase,
  SysSchedulerFOnesActiveUseCase,
  SysSchedulerFOnesUseCase,
  SysSchedulerRemManysUseCase,
  SysSchedulerRemOnesUseCase,
  SysSchedulerResetAllUseCase,
  SysSchedulerRunManualUseCase,
  SysSchedulerUOnesUseCase,
} from './usecase';

export const sysSchedulerContainer = container.createChildContainer();

//#region Container HttpClient
sysSchedulerContainer.register('SysSchedulers', {
  useClass: SysSchedulers,
});
//#endregion Container HttpClient

//#region Container RepositoryImpl
sysSchedulerContainer.register('SysSchedulerRepository', {
  useClass: SysSchedulerRepositoryImpl,
});
//#endregion Container RepositoryImpl

//#region Container Usecase
sysSchedulerContainer.register('SysSchedulerCOnesUseCase', {
  useClass: SysSchedulerCOnesUseCase,
});

sysSchedulerContainer.register('SysSchedulerFManysActiveUseCase', {
  useClass: SysSchedulerFManysActiveUseCase,
});

sysSchedulerContainer.register('SysSchedulerFManysUseCase', {
  useClass: SysSchedulerFManysUseCase,
});

sysSchedulerContainer.register('SysSchedulerFOnesActiveUseCase', {
  useClass: SysSchedulerFOnesActiveUseCase,
});

sysSchedulerContainer.register('SysSchedulerFOnesUseCase', {
  useClass: SysSchedulerFOnesUseCase,
});

sysSchedulerContainer.register('SysSchedulerRemManysUseCase', {
  useClass: SysSchedulerRemManysUseCase,
});

sysSchedulerContainer.register('SysSchedulerRemOnesUseCase', {
  useClass: SysSchedulerRemOnesUseCase,
});

sysSchedulerContainer.register('SysSchedulerResetAllUseCase', {
  useClass: SysSchedulerResetAllUseCase,
});

sysSchedulerContainer.register('SysSchedulerRunManualUseCase', {
  useClass: SysSchedulerRunManualUseCase,
});

sysSchedulerContainer.register('SysSchedulerUOnesUseCase', {
  useClass: SysSchedulerUOnesUseCase,
});
//#endregion Container Usecase
