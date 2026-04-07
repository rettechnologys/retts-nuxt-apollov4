import { sysLangContainer } from '../SysLangContainer';
import { SysLangFManysUseCase, SysLangFOnesUseCase } from '.';

function instanceSysLangFManysUseCase(): SysLangFManysUseCase {
  return sysLangContainer.resolve(SysLangFManysUseCase);
}

function instanceSysLangFOnesUseCase(): SysLangFOnesUseCase {
  return sysLangContainer.resolve(SysLangFOnesUseCase);
}

export const sysLangUseCaseResolver = {
  instanceSysLangFManysUseCase,
  instanceSysLangFOnesUseCase,
};
