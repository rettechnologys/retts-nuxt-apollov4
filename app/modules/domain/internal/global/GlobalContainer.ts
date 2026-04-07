import { Global } from '@/modules/data/internal/data-source/Global';
import { GlobalRepositoryImpl } from '@/modules/data/internal/repository/GlobalRepositoryImpl';
import { container } from 'tsyringe';
import {
  GlobalConfigUseCase,
  GlobalDownloadFileUseCase,
  GlobalHealthUseCase,
} from './usecase';

export const globalContainer = container.createChildContainer();

//#region Container HttpClient
globalContainer.register('Global', {
  useClass: Global,
});
//#endregion Container HttpClient

//#region Container RepositoryImpl
globalContainer.register('GlobalRepository', {
  useClass: GlobalRepositoryImpl,
});
//#endregion Container RepositoryImpl

//#region Container Usecase
globalContainer.register('GlobalConfigUseCase', {
  useClass: GlobalConfigUseCase,
});

globalContainer.register('GlobalHealthUseCase', {
  useClass: GlobalHealthUseCase,
});
globalContainer.register('GlobalDownloadFileUseCase', {
  useClass: GlobalDownloadFileUseCase,
});
//#endregion Container Usecase
