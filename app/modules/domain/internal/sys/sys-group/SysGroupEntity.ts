import type {
  CManySysGroupDto,
  CSysGroupDto,
  DManySysGroupDto,
  KeyUuidDto,
  RSysGroupDto,
  U2SysGroupDto,
  UManySysGroupDto,
  URManySysGroupDto,
  URSysGroupDto,
  USysGroupDto,
} from '~/modules/data/internal/data-source/data-contracts';
import { Expose } from 'class-transformer';

//#region Entity
export type SysGroupEntity = RSysGroupDto;
//#endregion Entity

//#region ReqBody
// export type DManySysGroupReqBody = DManySysGroupDto;
export class DManySysGroupReqBody implements DManySysGroupDto {
  @Expose()
  items: KeyUuidDto[] = [];
}

// export type UManySysGroupReqBody = UManySysGroupDto;
export class UManySysGroupReqBody implements UManySysGroupDto {
  @Expose()
  items: KeyUuidDto[] = [];

  @Expose()
  recover?: boolean | undefined;

  @Expose()
  data?: U2SysGroupDto | undefined;
}

// export type USysGroupReqBody = USysGroupDto;
export class USysGroupReqBody implements USysGroupDto {
  @Expose()
  description?: string;

  @Expose()
  sysGroupParentId?: number;
}

// export type CSysGroupReqBody = CSysGroupDto;
export class CSysGroupReqBody implements CSysGroupDto {
  @Expose()
  name!: string;

  @Expose()
  description!: string;

  @Expose()
  sysGroupParentId!: number;
}

// export type CManySysGroupReqBody = CManySysGroupDto;
export class CManySysGroupReqBody implements CManySysGroupDto {
  @Expose()
  items: CSysGroupDto[] = [];
}

// export type URManySysGroupReqBody = URManySysGroupDto;
export class URManySysGroupReqBody implements URManySysGroupDto {
  @Expose()
  items: URSysGroupDto[] = [];
}
//#endregion ReqBody
