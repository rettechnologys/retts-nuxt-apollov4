import type {
  CManySysUserDto,
  CSysUserDto,
  CSysUserProfileDto,
  DManySysUserDto,
  KeyUuidDto,
  RSysUserDto,
  RSysUserProfileDto,
  U2SysUserDto,
  UManySysUserDto,
  URManySysUserDto,
  URSysUserDto,
  USysUserDto,
} from '~/modules/data/internal/data-source/data-contracts';
import { Expose, Type, Transform, Exclude } from 'class-transformer';

//#region Entity
// export type SysUserEntity = RSysUserDto;

export interface ProfileEntity extends Omit<RSysUserProfileDto, 'birthDate'> {
  birthDate: string | Date;
}

export interface SysUserEntity extends Omit<RSysUserDto, 'profile'> {
  profile: ProfileEntity;
}
//#endregion Entity

//#region ReqBody
//export type DManySysUserReqBody = DManySysUserDto;
export class DManySysUserReqBody implements DManySysUserDto {
  @Expose()
  items!: KeyUuidDto[];
}

//export type UManySysUserReqBody = UManySysUserDto;
export class UManySysUserReqBody implements UManySysUserDto {
  @Expose()
  items!: KeyUuidDto[];

  @Expose()
  recover?: boolean | undefined;

  @Expose()
  data?: U2SysUserDto | undefined;
}

//export type USysUserReqBody = USysUserDto;
export class USysUserReqBody implements USysUserDto {
  @Expose()
  name?: string;

  @Expose()
  sysGroupId?: number;

  @Expose()
  password?: string;

  @Expose()
  confirmPassword?: string;

  @Expose()
  oldPassword?: string;

  @Expose()
  email?: string;

  @Expose()
  mobileNumber?: string;

  @Expose()
  isActive?: boolean;

  @Expose()
  profile?: CSysUserProfileDto;

  file?: File;

  signature?: File | undefined ;
}

//export type CSysUserReqBody = CSysUserDto;
export class CSysUserReqBody implements CSysUserDto {
  @Expose()
  name!: string;

  @Expose()
  sysGroupId!: number;

  @Expose()
  password!: string;

  @Expose()
  confirmPassword!: string;

  @Expose()
  email!: string;

  @Expose()
  mobileNumber?: string | undefined;

  @Expose()
  isActive?: boolean | undefined;

  @Expose()
  profile!: CSysUserProfileDto;

  file?: File;

  signature?: File | undefined;
}

//export type CManySysUserReqBody = CManySysUserDto;
export class CManySysUserReqBody implements CManySysUserDto {
  @Expose()
  items!: CSysUserDto[];
}

//export type URManySysUserReqBody = URManySysUserDto;
export class URManySysUserReqBody implements URManySysUserDto {
  @Expose()
  items!: URSysUserDto[];
}
//#endregion ReqBody
