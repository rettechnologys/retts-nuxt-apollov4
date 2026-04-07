import { sysSchedulerContainer } from '../SysSchedulerContainer';
import {
  SysSchedulerFManysUseCase,
  SysSchedulerFOnesUseCase,
  SysSchedulerRunManualUseCase,
} from '.';

function instanceSysSchedulerFManysUseCase(): SysSchedulerFManysUseCase {
  return sysSchedulerContainer.resolve(SysSchedulerFManysUseCase);
}

function instanceSysSchedulerFOnesUseCase(): SysSchedulerFOnesUseCase {
  return sysSchedulerContainer.resolve(SysSchedulerFOnesUseCase);
}

function instanceSysSchedulerRunManualUseCase(): SysSchedulerRunManualUseCase {
  return sysSchedulerContainer.resolve(SysSchedulerRunManualUseCase);
}

export const sysSchedulerUseCaseResolver = {
  instanceSysSchedulerFManysUseCase,
  instanceSysSchedulerFOnesUseCase,
  instanceSysSchedulerRunManualUseCase,
};
