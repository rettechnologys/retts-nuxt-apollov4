import { SysNotifsManuals } from '~/modules/data/internal/data-source/SysNotifsManuals';
import { SysNotifManualRepositoryImpl } from '~/modules/data/internal/repository/SysNotifManualRepositoryImpl';
import { container } from 'tsyringe';
import {
  SysNotifManualCOnesUseCase,
  SysNotifManualFManysUseCase,
  SysNotifManualFOnesUseCase,
  SysNotifManualRemManysUseCase,
  SysNotifManualRemOnesUseCase,
} from './usecase';

export const sysNotifManualContainer = container.createChildContainer();

//#region Container HttpClient
sysNotifManualContainer.register('SysNotifsManuals', {
  useClass: SysNotifsManuals,
});
//#endregion Container HttpClient

//#region Container RepositoryImpl
sysNotifManualContainer.register('SysNotifManualRepository', {
  useClass: SysNotifManualRepositoryImpl,
});
//#endregion Container RepositoryImpl

//#region Container Usecase
sysNotifManualContainer.register('SysNotifManualCOnesUseCase', {
  useClass: SysNotifManualCOnesUseCase,
});

sysNotifManualContainer.register('SysNotifManualFManysUseCase', {
  useClass: SysNotifManualFManysUseCase,
});

sysNotifManualContainer.register('SysNotifManualFOnesUseCase', {
  useClass: SysNotifManualFOnesUseCase,
});

sysNotifManualContainer.register('SysNotifManualRemManysUseCase', {
  useClass: SysNotifManualRemManysUseCase,
});

sysNotifManualContainer.register('SysNotifManualRemOnesUseCase', {
  useClass: SysNotifManualRemOnesUseCase,
});
//#endregion Container Usecase
