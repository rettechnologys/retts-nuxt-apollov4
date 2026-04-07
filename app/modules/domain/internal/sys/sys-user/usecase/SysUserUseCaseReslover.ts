import { sysUserContainer } from '../SysUserContainer';
import { SysUserFManysUseCase, SysUserFOnesUseCase } from '.';

function instanceSysUserFManysUseCase(): SysUserFManysUseCase {
  return sysUserContainer.resolve(SysUserFManysUseCase);
}

function instanceSysUserFOnesUseCase(): SysUserFOnesUseCase {
  return sysUserContainer.resolve(SysUserFOnesUseCase);
}

export const sysUserUseCaseResolver = {
  instanceSysUserFManysUseCase,
  instanceSysUserFOnesUseCase,
};
