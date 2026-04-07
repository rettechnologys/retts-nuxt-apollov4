import { SysLangs } from '~/modules/data/internal/data-source/SysLangs';
import { SysLangRepositoryImpl } from '~/modules/data/internal/repository/SysLangRepositoryImpl';
import { container } from 'tsyringe';
import {
  SysLangCUOnesUseCase,
  SysLangFManysUseCase,
  SysLangFOnesUseCase,
  SysLangRecOnesUseCase,
  SysLangRemOnesUseCase,
} from './usecase';

export const sysLangContainer = container.createChildContainer();

//#region Container HttpClient
sysLangContainer.register('SysLangs', {
  useClass: SysLangs,
});
//#endregion Container HttpClient

//#region Container RepositoryImpl
sysLangContainer.register('SysLangRepository', {
  useClass: SysLangRepositoryImpl,
});
//#endregion Container RepositoryImpl

//#region Container Usecase
sysLangContainer.register('SysLangCUOnesUseCase', {
  useClass: SysLangCUOnesUseCase,
});

sysLangContainer.register('SysLangFManysUseCase', {
  useClass: SysLangFManysUseCase,
});

sysLangContainer.register('SysLangFOnesUseCase', {
  useClass: SysLangFOnesUseCase,
});

sysLangContainer.register('SysLangRecOnesUseCase', {
  useClass: SysLangRecOnesUseCase,
});

sysLangContainer.register('SysLangRemOnesUseCase', {
  useClass: SysLangRemOnesUseCase,
});
//#endregion Container Usecase
