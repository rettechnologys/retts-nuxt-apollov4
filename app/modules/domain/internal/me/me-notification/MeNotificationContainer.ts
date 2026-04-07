import { MeNotifications } from '~/modules/data/internal/data-source/MeNotifications';
import { container } from 'tsyringe';
import {
  MeNotificationFManysUseCase,
  MeNotificationFOnesUseCase,
  MeNotificationReadUseCase,
} from './usecase';
import { MeNotificationRepositoryImpl } from '~/modules/data/internal/repository/MeNotificationRepositoryImpl';

export const meNotificationContainer = container.createChildContainer();

//#region Container HttpClient
meNotificationContainer.register('MeNotifications', {
  useClass: MeNotifications,
});
//#endregion Container HttpClient

//#region Container RepositoryImpl
meNotificationContainer.register('MeNotificationRepository', {
  useClass: MeNotificationRepositoryImpl,
});
//#endregion Container RepositoryImpl

//#region Container Usecase
meNotificationContainer.register('MeNotificationFManysUseCase', {
  useClass: MeNotificationFManysUseCase,
});

meNotificationContainer.register('MeNotificationFOnesUseCase', {
  useClass: MeNotificationFOnesUseCase,
});
meNotificationContainer.register('MeNotificationReadUseCase', {
  useClass: MeNotificationReadUseCase,
});
//#endregion Container Usecase
