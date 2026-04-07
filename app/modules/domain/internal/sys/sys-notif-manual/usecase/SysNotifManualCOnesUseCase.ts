import { Either } from '~/utils/helpers/Either';
import { UseCase } from '~/utils/helpers/UseCase';
import { IFailure } from '@/utils/types/Failure';
import { inject, singleton } from 'tsyringe';
import {
  CSysNotifManualReqBody,
  SysNotifManualEntity,
} from '../SysNotifManualEntity';
import type { SysNotifManualRepository } from '../SysNotifManualRepository';
import { RequestParams } from '~/modules/data/internal/data-source/http-client';

@singleton()
export class SysNotifManualCOnesUseCase
  implements UseCase<SysNotifManualEntity, CSysNotifManualReqBody>
{
  private sysNotifManualRepository: SysNotifManualRepository;

  constructor(
    @inject('SysNotifManualRepository')
    sysNotifManualRepository: SysNotifManualRepository,
  ) {
    this.sysNotifManualRepository = sysNotifManualRepository;
  }

  call(
    reqBody: CSysNotifManualReqBody,
    axiosConfig?: RequestParams,
  ): Promise<Either<IFailure, SysNotifManualEntity>> {
    return this.sysNotifManualRepository.createOnes(reqBody, axiosConfig);
  }
}
