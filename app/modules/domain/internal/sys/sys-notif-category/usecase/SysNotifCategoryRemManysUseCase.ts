import { Either } from '~/utils/helpers/Either';
import { UseCase } from '~/utils/helpers/UseCase';
import { IFailure } from '@/utils/types/Failure';
import { INonDataResponse } from '@/utils/types/ResponseInternal';
import { inject, singleton } from 'tsyringe';
import { DManySysNotifCategoryReqBody } from '../SysNotifCategoryEntity';
import type { SysNotifCategoryRepository } from '../SysNotifCategoryRepository';

@singleton()
export class SysNotifCategoryRemManysUseCase
  implements UseCase<INonDataResponse, DManySysNotifCategoryReqBody>
{
  private sysNotifCategoryRepository: SysNotifCategoryRepository;

  constructor(
    @inject('SysNotifCategoryRepository')
    sysNotifCategoryRepository: SysNotifCategoryRepository,
  ) {
    this.sysNotifCategoryRepository = sysNotifCategoryRepository;
  }

  call(
    reqBody: DManySysNotifCategoryReqBody,
  ): Promise<Either<IFailure, INonDataResponse>> {
    return this.sysNotifCategoryRepository.removeManys(reqBody);
  }
}
