import { USysMenuAclReqBody } from './SysMenuAclEntity';

export interface ISysMenuAclParam {
  sysGroupId: number;
  sysMenuId: number;
}

export interface ISysMenuAclParamReqBody extends ISysMenuAclParam {
  reqBody: USysMenuAclReqBody;
}
