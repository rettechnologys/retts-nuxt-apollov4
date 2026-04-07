import { Either } from '@retts-packages/utilities-helper';
import { UseCase } from '@retts-packages/utilities-helper';
import { IFailure } from '@/utils/types/Failure';
import { inject, singleton } from 'tsyringe';
import { GlobalDownloadFileEntity } from '../GlobalDownloadFileEntity';
import type { GlobalRepository } from '../GlobalRepository';
import { RequestParams } from '@/modules/data/internal/data-source/http-client';

@singleton()
export class GlobalDownloadFileUseCase
  implements UseCase<GlobalDownloadFileEntity, string> {
  private globalRepository: GlobalRepository;

  constructor(@inject('GlobalRepository') globalRepository: GlobalRepository) {
    this.globalRepository = globalRepository;
  }

  call(
    path: string,
    axiosConfig?: RequestParams,
  ): Promise<Either<IFailure, GlobalDownloadFileEntity>> {
    return this.globalRepository.downloadFile(path, axiosConfig);
  }
}
