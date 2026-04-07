import { sysApiKeyContainer } from '../SysApiKeyContainer';
import {
  // SysApiKeyFManysParentUseCase,
  SysApiKeyFManysUseCase,
  SysApiKeyFOnesUseCase,
} from '.';

function instanceSysApiKeyFManysUseCase(): SysApiKeyFManysUseCase {
  return sysApiKeyContainer.resolve(SysApiKeyFManysUseCase);
}

function instanceSysApiKeyFOnesUseCase(): SysApiKeyFOnesUseCase {
  return sysApiKeyContainer.resolve(SysApiKeyFOnesUseCase);
}

// function instanceSysApiKeyFManysParentUseCase(): SysApiKeyFManysParentUseCase {
//   return SysApiKeyContainer.resolve(SysApiKeyFManysParentUseCase);
// }

export const SysApiKeyUseCaseResolver = {
  instanceSysApiKeyFManysUseCase,
  instanceSysApiKeyFOnesUseCase,
  // instanceSysApiKeyFManysParentUseCase,
};
