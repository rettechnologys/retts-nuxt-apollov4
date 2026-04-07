import {
  CSysSchedulerDto,
  DManySysSchedulerDto,
  KeyUuidDto,
  RSysSchedulerDto,
  USysSchedulerDto,
} from '~/modules/data/internal/data-source/data-contracts';
import { Expose } from 'class-transformer';

//#region Entity
export type SysSchedulerEntity = RSysSchedulerDto;
//#endregion Entity

//#region ReqBody
// export type DManySysSchedulerReqBody = DManySysSchedulerDto;
export class DManySysSchedulerReqBody implements DManySysSchedulerDto {
  @Expose()
  items: KeyUuidDto[] = [];
}

//export type USysSchedulerReqBody = USysSchedulerDto;
export class USysSchedulerReqBody implements USysSchedulerDto {
  @Expose()
  name?: string;

  @Expose()
  isActive?: boolean;

  @Expose()
  cronType?: 'InternalFunc' | 'AccessUrl' | 'ShellScript' | 'BackupDB';

  @Expose()
  cronExpression?: string;

  @Expose()
  cmdFuncPathUrl?: string;
}

//export type CSysSchedulerReqBody = CSysSchedulerDto;
export class CSysSchedulerReqBody implements CSysSchedulerDto {
  @Expose()
  name!: string;

  @Expose()
  isActive?: boolean | undefined;

  @Expose()
  cronType: 'InternalFunc' | 'AccessUrl' | 'ShellScript' | 'BackupDB' = "InternalFunc";

  @Expose()
  cronExpression!: string;

  @Expose()
  cmdFuncPathUrl?: string | undefined;
}
//#endregion ReqBody
