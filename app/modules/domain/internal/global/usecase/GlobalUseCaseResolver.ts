import { globalContainer } from '../GlobalContainer';
import {
  GlobalConfigUseCase,
  GlobalHealthUseCase,
  GlobalDownloadFileUseCase,
} from '.';

function instanceGlobalConfigUseCase(): GlobalConfigUseCase {
  return globalContainer.resolve(GlobalConfigUseCase);
}

function instanceGlobalHealthUseCase(): GlobalHealthUseCase {
  return globalContainer.resolve(GlobalHealthUseCase);
}

function instanceGlobalDownloadFileUseCase(): GlobalDownloadFileUseCase {
  return globalContainer.resolve(GlobalDownloadFileUseCase);
}

export const globalUseCaseResolver = {
  instanceGlobalConfigUseCase,
  instanceGlobalHealthUseCase,
  instanceGlobalDownloadFileUseCase,
};
