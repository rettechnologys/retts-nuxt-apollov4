import type {
  CManySysApiKeyDto,
  CSysApiKeyDto,
  DManySysApiKeyDto,
  KeyUuidDto,
  RSysApiKeyDto,
  U2SysApiKeyDto,
  UManySysApiKeyDto,
  USysApiKeyDto,
} from '~/modules/data/internal/data-source/data-contracts';
import { Expose } from 'class-transformer';

//#region Entity
export type SysApiKeyEntity = RSysApiKeyDto;
//#endregion Entity

//#region ReqBody
// export type DManySysApiKeyReqBody = DManySysApiKeyDto;
export class DManySysApiKeyReqBody implements DManySysApiKeyDto {
  @Expose()
  items: KeyUuidDto[] = [];
}

// export type UManySysApiKeyReqBody = UManySysApiKeyDto;
export class UManySysApiKeyReqBody implements UManySysApiKeyDto {
  @Expose()
  items: KeyUuidDto[] = [];

  @Expose()
  recover?: boolean | undefined;

  @Expose()
  data?: U2SysApiKeyDto | undefined;
}

// export type USysApiKeyReqBody = USysApiKeyDto;
export class USysApiKeyReqBody implements USysApiKeyDto {
  @Expose()
  description?: string;

  @Expose()
  name?: string;
}

// export type CSysApiKeyReqBody = CSysApiKeyDto;
export class CSysApiKeyReqBody implements CSysApiKeyDto {
  @Expose()
  name!: string;

  @Expose()
  description!: string;
}

// export type CManySysApiReqBody = CManySysApiKeyDto;
export class CManySysApiKeyReqBody implements CManySysApiKeyDto {
  @Expose()
  items: CSysApiKeyDto[] = [];
}

//#endregion ReqBody
