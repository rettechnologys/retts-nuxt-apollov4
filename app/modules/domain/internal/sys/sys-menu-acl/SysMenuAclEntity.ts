import {
  RSysMenuAclActionsDto,
  RSysMenuAclDto,
  RSysMenuAclSimpleDto,
  USysMenuAclDto,
} from '~/modules/data/internal/data-source/data-contracts';
import { Expose } from 'class-transformer';

//#region Entity
export type SysMenuAclEntity = RSysMenuAclDto;
export type SysMenuAclActionsEntity = RSysMenuAclActionsDto;
export type SysMenuAclSimpleEntity = RSysMenuAclSimpleDto;
//#endregion Entity

//#region ReqBody
// export type USysMenuAclReqBody = USysMenuAclDto;
export class USysMenuAclReqBody implements USysMenuAclDto {
  @Expose()
  isActive?: boolean;

  @Expose()
  actions?: string[];
}
//#endregion ReqBody
