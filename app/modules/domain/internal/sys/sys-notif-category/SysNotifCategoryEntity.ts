import {
  CSysNotifCategoryDto,
  DManySysNotifCategoryDto,
  KeyUuidDto,
  RSysNotifCategoryDto,
  USysNotifCategoryDto,
} from '~/modules/data/internal/data-source/data-contracts';
import { Expose } from 'class-transformer';

//#region Entity
export type SysNotifCategoryEntity = RSysNotifCategoryDto;
//#endregion Entity

//#region ReqBody
export class CSysNotifCategoryReqBody implements CSysNotifCategoryDto {
  @Expose()
  name!: string;
  @Expose()
  description!: string;
  @Expose()
  isGlobal!: boolean;
}

export class USysNotifCategoryReqBody implements USysNotifCategoryDto {
  @Expose()
  description?: string | undefined;
  @Expose()
  isGlobal?: boolean | undefined;
}

export class DManySysNotifCategoryReqBody implements DManySysNotifCategoryDto {
  @Expose()
  items!: KeyUuidDto[];
}
//#endregion ReqBody
