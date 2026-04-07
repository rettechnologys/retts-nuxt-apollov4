import {
  CSysConfigCategoryChildDto,
  CSysConfigCategoryDto,
  DManySysConfigCategoryDto,
  KeyUuidDto,
  RSysConfigCategoryDto,
  USysConfigCategoryChilDto,
  USysConfigCategoryDto,
} from '~/modules/data/internal/data-source/data-contracts';
import { Expose } from 'class-transformer';

//#region Entity
export type SysConfigCategoryEntity = RSysConfigCategoryDto;
//#endregion Entity

//#region ReqBody
// export type DManySysConfigCategoryReqBody = DManySysConfigCategoryDto;
export class DManySysConfigCategoryReqBody
  implements DManySysConfigCategoryDto
{
  @Expose()
  items: KeyUuidDto[] = [];
}

// export type USysConfigCategoryReqBody = USysConfigCategoryDto;
export class USysConfigCategoryReqBody implements USysConfigCategoryDto {
  @Expose()
  sysConfigs: USysConfigCategoryChilDto[] = [];

  @Expose()
  name?: string | undefined;
  @Expose()
  description?: string;

  @Expose()
  SysConfigCategoryParentId?: number;
}

// export type CSysConfigCategoryReqBody = CSysConfigCategoryDto;
export class CSysConfigCategoryReqBody implements CSysConfigCategoryDto {
  @Expose()
  sysConfigs: CSysConfigCategoryChildDto[] = [];
  
  @Expose()
  name!: string;

  @Expose()
  description!: string;

  @Expose()
  SysConfigCategoryParentId!: number;
}
//#endregion ReqBody
