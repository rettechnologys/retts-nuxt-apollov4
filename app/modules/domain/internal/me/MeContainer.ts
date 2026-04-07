import { Me } from '~/modules/data/internal/data-source/Me';
import { MeRepositoryImpl } from '~/modules/data/internal/repository/MeRepositoryImpl';
import { container } from 'tsyringe';
import { MeUseCase } from './usecase';

export const meContainer = container.createChildContainer();

//#region Container HttpClient
meContainer.register('Me', {
  useClass: Me,
});
//#endregion Container HttpClient

//#region Container RepositoryImpl
meContainer.register('MeRepository', {
  useClass: MeRepositoryImpl,
});
//#endregion Container RepositoryImpl

//#region Container Usecase
meContainer.register('MeUseCase', {
  useClass: MeUseCase,
});
//#endregion Container Usecase
