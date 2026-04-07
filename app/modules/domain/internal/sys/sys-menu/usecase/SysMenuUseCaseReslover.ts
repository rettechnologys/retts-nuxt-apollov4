import { sysMenuContainer } from '../SysMenuContainer';
import { SysMenuFManysUseCase, SysMenuFOnesUseCase } from '.';

function instanceSysMenuFManysUseCase(): SysMenuFManysUseCase {
  return sysMenuContainer.resolve(SysMenuFManysUseCase);
}

function instanceSysMenuFOnesUseCase(): SysMenuFOnesUseCase {
  return sysMenuContainer.resolve(SysMenuFOnesUseCase);
}

export const sysMenuUseCaseResolver = {
  instanceSysMenuFManysUseCase,
  instanceSysMenuFOnesUseCase,
};
