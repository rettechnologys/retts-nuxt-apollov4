import { Either } from '~/utils/helpers/Either';
import { UseCase } from '~/utils/helpers/UseCase';
import { IFailure } from '@/utils/types/Failure';
import { IReqUidBody } from '@/utils/types/RequestInternal';
import { inject, singleton } from 'tsyringe';
import {
  SysNotifCategoryEntity,
  USysNotifCategoryReqBody,
} from '../SysNotifCategoryEntity';
import type { SysNotifCategoryRepository } from '../SysNotifCategoryRepository';

@singleton()
export class SysNotifCategoryUOnesUseCase
  implements
    UseCase<SysNotifCategoryEntity, IReqUidBody<USysNotifCategoryReqBody>>
{
  private sysNotifCategoryRepository: SysNotifCategoryRepository;

  constructor(
    @inject('SysNotifCategoryRepository')
    sysNotifCategoryRepository: SysNotifCategoryRepository,
  ) {
    this.sysNotifCategoryRepository = sysNotifCategoryRepository;
  }

  call(
    reqUidBody: IReqUidBody<USysNotifCategoryReqBody>,
  ): Promise<Either<IFailure, SysNotifCategoryEntity>> {
    return this.sysNotifCategoryRepository.updateOnes(
      reqUidBody.uid.toString(),
      reqUidBody.reqBody,
    );
  }
}
