import { sysGroupContainer } from '../SysGroupContainer';
import {
  SysGroupFManysParentUseCase,
  SysGroupFManysUseCase,
  SysGroupFOnesUseCase,
} from '.';

function instanceSysGroupFManysUseCase(): SysGroupFManysUseCase {
  return sysGroupContainer.resolve(SysGroupFManysUseCase);
}

function instanceSysGroupFOnesUseCase(): SysGroupFOnesUseCase {
  return sysGroupContainer.resolve(SysGroupFOnesUseCase);
}

function instanceSysGroupFManysParentUseCase(): SysGroupFManysParentUseCase {
  return sysGroupContainer.resolve(SysGroupFManysParentUseCase);
}

export const sysGroupUseCaseResolver = {
  instanceSysGroupFManysUseCase,
  instanceSysGroupFOnesUseCase,
  instanceSysGroupFManysParentUseCase,
};
