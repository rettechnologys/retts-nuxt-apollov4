import { MeProfiles } from '~/modules/data/internal/data-source/MeProfiles';
import { MeProfileRepositoryImpl } from '~/modules/data/internal/repository/MeProfileRepositoryImpl';
import { container } from 'tsyringe';
import { MeProfileUAvatarUseCase, MeProfileUOnesUseCase } from './usecase';

export const meProfileContainer = container.createChildContainer();

//#region Container HttpClient
meProfileContainer.register('MeProfiles', {
  useClass: MeProfiles,
});
//#endregion Container HttpClient

//#region Container RepositoryImpl
meProfileContainer.register('MeProfileRepository', {
  useClass: MeProfileRepositoryImpl,
});
//#endregion Container RepositoryImpl

//#region Container Usecase
meProfileContainer.register('MeProfileUOnesUseCase', {
  useClass: MeProfileUOnesUseCase,
});

meProfileContainer.register('MeProfileUAvatarUseCase', {
  useClass: MeProfileUAvatarUseCase,
});
//#endregion Container Usecase
