import {
  CUManySysConfigDto,
  CUSysConfigDto,
  DKeySysConfigDto,
  DManySysConfigDto,
  RSysConfigDto,
  RSysDateDto,
} from '~/modules/data/internal/data-source/data-contracts';
import { Exclude, Expose } from 'class-transformer';

//#region Entity
// export type SysConfigEntity = RSysConfigDto;
export class SysConfigEntity implements RSysConfigDto {
  keyword!: string;
  value: any;
  description!: string;
  orderNumber!: number;
  isPublic!: boolean;
  sysConfigCategoryId!: number;
  sysDate!: RSysDateDto;
  valueType!: 'string' |
    'number' |
    'boolean' |
    'object' |
    'arrayString' |
    'arrayNumber' |
    'arrayDecimal' |
    'arrayBoolean' |
    'arrayObject';
}
//#endregion Entity

//#region ReqBody
// export type DManySysConfigReqBody = DManySysConfigDto;
export class DManySysConfigReqBody implements DManySysConfigDto {
  @Expose()
  items!: DKeySysConfigDto[];
}

// export type CUSysConfigReqBody = CUSysConfigDto;
export class CUSysConfigReqBody implements CUSysConfigDto {
  @Expose()
  keyword!: string;

  @Expose()
  value!: string;

  // @Exclude()
  // valueType?:
  //   | 'string'
  //   | 'number'
  //   | 'boolean'
  //   | 'object'
  //   | 'arrayString'
  //   | 'arrayNumber'
  //   | 'arrayBoolean'
  //   | 'arrayObject';

  // @Exclude()
  // description?: string | undefined;

  // @Exclude()
  // sysConfigCategoryId?: number;

  // @Exclude()
  // isPublic?: boolean;

  // @Exclude()
  // orderNumber?: number;
}

// export type CUManySysConfigReqBody = CUManySysConfigDto;
export class CUManySysConfigReqBody implements CUManySysConfigDto {
  @Expose()
  items!: CUSysConfigDto[];
}
//#endregion ReqBody
