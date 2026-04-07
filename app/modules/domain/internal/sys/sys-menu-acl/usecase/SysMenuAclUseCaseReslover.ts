import { sysMenuAclContainer } from '../SysMenuAclContainer';
import { SysMenuAclFManysActionsUseCase, SysMenuAclFManysUseCase } from '.';

function instanceSysMenuAclFManysUseCase(): SysMenuAclFManysUseCase {
  return sysMenuAclContainer.resolve(SysMenuAclFManysUseCase);
}

function instanceSysMenuAclFManysActionsUseCase(): SysMenuAclFManysActionsUseCase {
  return sysMenuAclContainer.resolve(SysMenuAclFManysActionsUseCase);
}

export const sysMenuAclUseCaseResolver = {
  instanceSysMenuAclFManysUseCase,
  instanceSysMenuAclFManysActionsUseCase,
};
