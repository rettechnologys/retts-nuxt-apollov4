import { sysConfigCategoryContainer } from '../SysConfigCategoryContainer';
import {
  SysConfigCategoryFManysUseCase,
  SysConfigCategoryFOnesUseCase,
} from '.';

function instanceSysConfigCategoryFManysUseCase(): SysConfigCategoryFManysUseCase {
  return sysConfigCategoryContainer.resolve(SysConfigCategoryFManysUseCase);
}

function instanceSysConfigCategoryFOnesUseCase(): SysConfigCategoryFOnesUseCase {
  return sysConfigCategoryContainer.resolve(SysConfigCategoryFOnesUseCase);
}

export const sysConfigCategoryUseCaseResolver = {
  instanceSysConfigCategoryFManysUseCase,
  instanceSysConfigCategoryFOnesUseCase,
};
