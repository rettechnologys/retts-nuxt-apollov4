import {
  CSysMenuDto,
  CSysMenuLangDto,
  RSysMenuDto,
  RSysMenuLangDto,
  URManySysMenuDto,
  URSysMenuDto,
  USysMenuDto,
} from '~/modules/data/internal/data-source/data-contracts';
import { Expose } from 'class-transformer';

//#region Entity
// export type SysMenuEntity = RSysMenuDto;
export class SysMenuEntity implements RSysMenuDto {
  @Expose()
  id!: number;

  @Expose()
  uuid!: string;

  @Expose()
  name!: string;

  @Expose()
  parentId!: number | null;

  @Expose()
  linkType!: string;

  @Expose()
  linkTarget!: string;

  @Expose()
  url!: string;

  @Expose()
  path!: string;

  @Expose()
  actions!: string[] | null;

  @Expose()
  orderNumber!: number | null;

  @Expose()
  iconCls!: string | null;

  @Expose()
  isHidden!: boolean;

  @Expose()
  sysMenuLangs!: RSysMenuLangDto[];

  @Expose()
  children!: RSysMenuDto[];
}
export type SysMenuLangEntity = RSysMenuLangDto;
//#endregion Entity

//#region ReqBody
// export type USysMenuReqBody = USysMenuDto;
export class USysMenuReqBody implements USysMenuDto {
  @Expose()
  name?: string;

  @Expose()
  linkType?: 'internal' | 'external' | undefined;

  @Expose()
  linkTarget?: 'self' | '_blank' | undefined;

  @Expose()
  isHidden?: boolean;

  @Expose()
  url?: string;

  @Expose()
  path?: string;

  @Expose()
  iconCls?: string;

  @Expose()
  actions?: string[];

  @Expose()
  sysMenuLangs?: CSysMenuLangDto[];
}

// export type CSysMenuReqBody = CSysMenuDto;
export class CSysMenuReqBody implements CSysMenuDto {
  @Expose()
  parentId?: number | undefined;

  @Expose()
  name!: string;

  @Expose()
  linkType?: 'internal' | 'external' | undefined;

  @Expose()
  linkTarget?: 'self' | '_blank' | undefined;

  @Expose()
  isHidden?: boolean | undefined;

  @Expose()
  url?: string;

  @Expose()
  path!: string;

  @Expose()
  iconCls?: string | undefined;

  @Expose()
  actions!: string[];

  @Expose()
  sysMenuLangs!: CSysMenuLangDto[];
}

// export type URManySysMenuReqBody = URManySysMenuDto;
export class URManySysMenuReqBody implements URManySysMenuDto {
  @Expose()
  items!: URSysMenuDto[];

  @Expose()
  parentId?: number | undefined;
}
//#endregion ReqBody
