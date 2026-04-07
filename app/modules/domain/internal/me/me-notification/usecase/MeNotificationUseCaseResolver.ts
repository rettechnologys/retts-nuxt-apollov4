import { meNotificationContainer } from '../MeNotificationContainer';
import {
  MeNotificationFManysUseCase,
  MeNotificationFOnesUseCase,
  MeNotificationReadUseCase,
} from '../usecase';

function instanceMeNotificationFManysUseCase(): MeNotificationFManysUseCase {
  return meNotificationContainer.resolve(MeNotificationFManysUseCase);
}

function instanceMeNotificationFOnesUseCase(): MeNotificationFOnesUseCase {
  return meNotificationContainer.resolve(MeNotificationFOnesUseCase);
}
function instanceMeNotificationReadUseCase(): MeNotificationReadUseCase {
  return meNotificationContainer.resolve(MeNotificationReadUseCase);
}

export const MeNotificationUseCaseResolver = {
  instanceMeNotificationFManysUseCase,
  instanceMeNotificationFOnesUseCase,
  instanceMeNotificationReadUseCase,
};
