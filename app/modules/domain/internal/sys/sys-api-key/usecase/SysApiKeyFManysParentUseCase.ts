// import { Either } from '@/utils/helpers/Either';
// import { UseCase } from '@/utils/helpers/UseCase';
// import { IFailure } from '@/utils/types/Failure';
// import { INoParam } from '@/utils/types/NoParam';
// import { inject, singleton } from 'tsyringe';
// import type { SysApiKeyRepository } from '../SysApiKeyRepository';

// @singleton()
// export class SysApiKeyFManysParentUseCase
//   implements UseCase<SysApiKeyParentEntity[], INoParam>
// {
//   private sysGroupRepository: SysApiKeyRepository;

//   constructor(
//     @inject('SysApiKeyRepository') sysGroupRepository: SysApiKeyRepository,
//   ) {
//     this.sysGroupRepository = sysGroupRepository;
//   }

//   call(): Promise<Either<IFailure, SysApiKeyParentEntity[]>> {
//     return this.sysGroupRepository.findManysParent();
//   }
// }
