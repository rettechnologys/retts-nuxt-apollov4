import { Either } from '~/utils/helpers/Either';
import { UseCase } from '~/utils/helpers/UseCase';
import { IFailure } from '@/utils/types/Failure';
import { inject, singleton } from 'tsyringe';
import {
  CSysNotifCategoryReqBody,
  SysNotifCategoryEntity,
} from '../SysNotifCategoryEntity';
import type { SysNotifCategoryRepository } from '../SysNotifCategoryRepository';

@singleton()
export class SysNotifCategoryCOnesUseCase
  implements UseCase<SysNotifCategoryEntity, CSysNotifCategoryReqBody>
{
  private sysNotifCategoryRepository: SysNotifCategoryRepository;

  constructor(
    @inject('SysNotifCategoryRepository')
    sysNotifCategoryRepository: SysNotifCategoryRepository,
  ) {
    this.sysNotifCategoryRepository = sysNotifCategoryRepository;
  }

  call(
    reqBody: CSysNotifCategoryReqBody,
  ): Promise<Either<IFailure, SysNotifCategoryEntity>> {
    return this.sysNotifCategoryRepository.createOnes(reqBody);
  }
}
