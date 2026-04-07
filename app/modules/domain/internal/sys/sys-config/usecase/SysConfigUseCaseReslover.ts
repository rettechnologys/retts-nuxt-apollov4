import { sysConfigContainer } from '../SysConfigContainer';
import { SysConfigFManysUseCase, SysConfigFOnesUseCase } from '.';

function instanceSysConfigFManysUseCase(): SysConfigFManysUseCase {
  return sysConfigContainer.resolve(SysConfigFManysUseCase);
}

function instanceSysConfigFOnesUseCase(): SysConfigFOnesUseCase {
  return sysConfigContainer.resolve(SysConfigFOnesUseCase);
}

export const sysConfigUseCaseResolver = {
  instanceSysConfigFManysUseCase,
  instanceSysConfigFOnesUseCase,
};
