import { sysNotifManualContainer } from '../SysNotifManualContainer';
import { SysNotifManualFManysUseCase, SysNotifManualFOnesUseCase } from '.';

function instanceSysNotifManualFManysUseCase(): SysNotifManualFManysUseCase {
  return sysNotifManualContainer.resolve(SysNotifManualFManysUseCase);
}

function instanceSysNotifManualFOnesUseCase(): SysNotifManualFOnesUseCase {
  return sysNotifManualContainer.resolve(SysNotifManualFOnesUseCase);
}

export const sysNotifManualUseCaseResolver = {
  instanceSysNotifManualFManysUseCase,
  instanceSysNotifManualFOnesUseCase,
};
