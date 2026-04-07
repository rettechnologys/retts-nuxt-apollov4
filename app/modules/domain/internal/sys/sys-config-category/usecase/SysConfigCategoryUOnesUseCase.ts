import { Either } from '~/utils/helpers/Either';
import { UseCase } from '~/utils/helpers/UseCase';
import { IFailure } from '@/utils/types/Failure';
import { IReqUidBody } from '@/utils/types/RequestInternal';
import { inject, singleton } from 'tsyringe';
import {
  SysConfigCategoryEntity,
  USysConfigCategoryReqBody,
} from '../SysConfigCategoryEntity';
import type { SysConfigCategoryRepository } from '../SysConfigCategoryRepository';

@singleton()
export class SysConfigCategoryUOnesUseCase
  implements
    UseCase<SysConfigCategoryEntity, IReqUidBody<USysConfigCategoryReqBody>>
{
  private SysConfigCategoryRepository: SysConfigCategoryRepository;

  constructor(
    @inject('SysConfigCategoryRepository')
    SysConfigCategoryRepository: SysConfigCategoryRepository,
  ) {
    this.SysConfigCategoryRepository = SysConfigCategoryRepository;
  }

  call(
    reqUidBody: IReqUidBody<USysConfigCategoryReqBody>,
  ): Promise<Either<IFailure, SysConfigCategoryEntity>> {
    return this.SysConfigCategoryRepository.updateOnes(
      reqUidBody.uid.toString(),
      reqUidBody.reqBody,
    );
  }
}
