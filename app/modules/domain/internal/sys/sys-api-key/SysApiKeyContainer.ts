import { SysApiKeys } from '~/modules/data/internal/data-source/SysApiKeys';
import { SysApiKeyRepositoryImpl } from '~/modules/data/internal/repository/SysApiKeyRepositoryImpl';
import { container } from 'tsyringe';
import {
  SysApiKeyCManysUseCase,
  SysApiKeyCOnesUseCase,
  // SysApiKeyFManysParentUseCase,
  SysApiKeyFManysUseCase,
  SysApiKeyFOnesUseCase,
  SysApiKeyRecOnesUseCase,
  SysApiKeyRemManysUseCase,
  SysApiKeyRemOnesUseCase,
  SysApiKeyUManysUseCase,
  SysApiKeyUOnesUseCase,
} from './usecase';

export const sysApiKeyContainer = container.createChildContainer();

//#region Container HttpClient
sysApiKeyContainer.register('SysApiKeys', {
  useClass: SysApiKeys,
});
//#endregion Container HttpClient

//#region Container RepositoryImpl
sysApiKeyContainer.register('SysApiKeyRepository', {
  useClass: SysApiKeyRepositoryImpl,
});
//#endregion Container RepositoryImpl

//#region Container Usecase
sysApiKeyContainer.register('SysApiKeyCManysUseCase', {
  useClass: SysApiKeyCManysUseCase,
});

sysApiKeyContainer.register('SysApiKeyCOnesUseCase', {
  useClass: SysApiKeyCOnesUseCase,
});

// sysApiKeyContainer.register('SysApiKeyFManysParentUseCase', {
//   useClass: SysApiKeyFManysParentUseCase,
// });

sysApiKeyContainer.register('SysApiKeyFManysUseCase', {
  useClass: SysApiKeyFManysUseCase,
});

sysApiKeyContainer.register('SysApiKeyFOnesUseCase', {
  useClass: SysApiKeyFOnesUseCase,
});

sysApiKeyContainer.register('SysApiKeyRecOnesUseCase', {
  useClass: SysApiKeyRecOnesUseCase,
});

sysApiKeyContainer.register('SysApiKeyRemManysUseCase', {
  useClass: SysApiKeyRemManysUseCase,
});

sysApiKeyContainer.register('SysApiKeyRemOnesUseCase', {
  useClass: SysApiKeyRemOnesUseCase,
});

sysApiKeyContainer.register('SysApiKeyUManysUseCase', {
  useClass: SysApiKeyUManysUseCase,
});

sysApiKeyContainer.register('SysApiKeyUOnesUseCase', {
  useClass: SysApiKeyUOnesUseCase,
});
//#endregion Container Usecase
