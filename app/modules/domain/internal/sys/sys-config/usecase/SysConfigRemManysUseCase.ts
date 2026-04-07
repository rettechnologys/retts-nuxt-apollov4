import { Either } from '~/utils/helpers/Either';
import { UseCase } from '~/utils/helpers/UseCase';
import { IFailure } from '@/utils/types/Failure';
import { INonDataResponse } from '@/utils/types/ResponseInternal';
import { inject, singleton } from 'tsyringe';
import { DManySysConfigReqBody } from '../SysConfigEntity';
import type { SysConfigRepository } from '../SysConfigRepository';

@singleton()
export class SysConfigRemManysUseCase
  implements UseCase<INonDataResponse, DManySysConfigReqBody>
{
  private sysConfigRepository: SysConfigRepository;

  constructor(
    @inject('SysConfigRepository') sysConfigRepository: SysConfigRepository,
  ) {
    this.sysConfigRepository = sysConfigRepository;
  }

  call(
    reqBody: DManySysConfigReqBody,
  ): Promise<Either<IFailure, INonDataResponse>> {
    return this.sysConfigRepository.removeManys(reqBody);
  }
}
