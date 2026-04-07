import { Either } from '~/utils/helpers/Either';
import { UseCase } from '~/utils/helpers/UseCase';
import { IFailure } from '@/utils/types/Failure';
import { inject, singleton } from 'tsyringe';
import {
  CSysConfigCategoryReqBody,
  SysConfigCategoryEntity,
} from '../SysConfigCategoryEntity';
import type { SysConfigCategoryRepository } from '../SysConfigCategoryRepository';

@singleton()
export class SysConfigCategoryCOnesUseCase
  implements UseCase<SysConfigCategoryEntity, CSysConfigCategoryReqBody>
{
  private SysConfigCategoryRepository: SysConfigCategoryRepository;

  constructor(
    @inject('SysConfigCategoryRepository')
    SysConfigCategoryRepository: SysConfigCategoryRepository,
  ) {
    this.SysConfigCategoryRepository = SysConfigCategoryRepository;
  }

  call(
    reqBody: CSysConfigCategoryReqBody,
  ): Promise<Either<IFailure, SysConfigCategoryEntity>> {
    return this.SysConfigCategoryRepository.createOnes(reqBody);
  }
}
