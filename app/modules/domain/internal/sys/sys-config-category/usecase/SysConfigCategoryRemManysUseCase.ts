import { Either } from '~/utils/helpers/Either';
import { UseCase } from '~/utils/helpers/UseCase';
import { IFailure } from '@/utils/types/Failure';
import { INonDataResponse } from '@/utils/types/ResponseInternal';
import { inject, singleton } from 'tsyringe';
import { DManySysConfigCategoryReqBody } from '../SysConfigCategoryEntity';
import type { SysConfigCategoryRepository } from '../SysConfigCategoryRepository';

@singleton()
export class SysConfigCategoryRemManysUseCase
  implements UseCase<INonDataResponse, DManySysConfigCategoryReqBody>
{
  private SysConfigCategoryRepository: SysConfigCategoryRepository;

  constructor(
    @inject('SysConfigCategoryRepository')
    SysConfigCategoryRepository: SysConfigCategoryRepository,
  ) {
    this.SysConfigCategoryRepository = SysConfigCategoryRepository;
  }

  call(
    reqBody: DManySysConfigCategoryReqBody,
  ): Promise<Either<IFailure, INonDataResponse>> {
    return this.SysConfigCategoryRepository.removeManys(reqBody);
  }
}
