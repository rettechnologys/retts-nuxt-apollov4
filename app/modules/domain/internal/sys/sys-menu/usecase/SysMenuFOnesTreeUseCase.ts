import { Either } from '~/utils/helpers/Either';
import { UseCase } from '~/utils/helpers/UseCase';
import { IFailure } from '@/utils/types/Failure';
import { inject, singleton } from 'tsyringe';
import { SysMenuEntity } from '../SysMenuEntity';
import type { SysMenuRepository } from '../SysMenuRepository';

@singleton()
export class SysMenuFOnesTreeUseCase implements UseCase<SysMenuEntity, string> {
  private sysMenuRepository: SysMenuRepository;

  constructor(
    @inject('SysMenuRepository') sysMenuRepository: SysMenuRepository,
  ) {
    this.sysMenuRepository = sysMenuRepository;
  }

  call(uuid: string): Promise<Either<IFailure, SysMenuEntity>> {
    return this.sysMenuRepository.findOnesTree(uuid);
  }
}
