import type {
  LoginAuthDto,
  LoginAzureAuthDto,
  RAuthRefreshTokenDto,
} from '@/modules/data/internal/data-source/data-contracts';
import type { SysMenuAclEntity } from '../sys/sys-menu-acl/SysMenuAclEntity';
import type { SysUserEntity } from '../sys/sys-user/SysUserEntity';

//#region Entity
// export type AuthEntity = RAuthDto; => extends
// export class AuthEntity implements RAuthDto {
//   sysUser: SysUserEntity;
//   sysMenuAcls: SysMenuAclEntity[];
//   authToken: AuthTokenEntity;
// }
export interface AuthEntity {
  sysUser: SysUserEntity;
  sysMenuAcls: SysMenuAclEntity[];
  accessToken: string;
}
// export type AuthTokenEntity = RAuthTokenDto;
export type AuthRefreshTokenEntity = RAuthRefreshTokenDto;
// export type AuthMeEntity = RAuthMeDto;
//#endregion Entity

//#region ReqBody
export type LoginAuthReqBody = LoginAuthDto;
export type LoginAzureAuthReqBody = LoginAzureAuthDto;
export type LoginAzureAuthReqParam = {
  accessToken: string;
  idToken: string;
};

export interface ForgotAuthReqBody {
  email: string;
}
//#endregion ReqBody
