/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface RErrorArrayDto {
  /** @default false */
  success: boolean;
  message: string[];
  meta: RMetaNonDataDto;
}

export interface RErrorDto {
  /** @default false */
  success: boolean;
  message: string;
  meta: RMetaNonDataDto;
}

export interface RDataDto {
  /** @default true */
  success: boolean;
  message: string;
  meta: RMetaDataDto;
}

export interface RSysDateDto {
  createdAt: number;
  createdBy: string;
  updatedAt: number | null;
  updatedBy: string | null;
}

export interface RSysUserProfileFullNameDto {
  firstName: string;
  lastName: string;
}

export interface RSysUserProfileDto {
  fullName: RSysUserProfileFullNameDto;
  gender: string;
  birthDate: string;
  birthPlace: string;
  emailSecondary: string;
  mobileNumberSecondary: string;
  lang: string;
  avatarUrl: string;
  signatureUrl: string;
}

export interface RSysUserGroupDto {
  sysGroupParentId: number;
  role: string;
  name: string;
}

export interface RPeruriUserDto {
  ktp: string;
  ktpFile: string;
  npwp: string;
  npwpFile: string;
  specimentFile: string;
  specimentBase64: string;
  province: string;
  city: string;
  address: string;
  orgUnit: string;
  workUnit: string;
  position: string;
  ekycFile: string;
  statusCode: string;
  status: string;
  isExpired: boolean;
}

export interface RSysUserDto {
  id: number;
  uuid: string;
  name: string;
  sysGroupId: number;
  email: string;
  mobileNumber: string;
  isActive: boolean;
  sysDate: RSysDateDto;
  profile: RSysUserProfileDto;
  sysGroup: RSysUserGroupDto;
  peruriUser: RPeruriUserDto;
}

export interface RSysMenuLangDto {
  sysLangId: string;
  description: string;
}

export interface RSysMenuAclDto {
  id: number;
  uuid: string;
  name: string;
  parentId: number | null;
  linkType: string;
  linkTarget: string;
  url: string;
  path: string;
  actions: string[] | null;
  orderNumber: number | null;
  iconCls: string | null;
  isHidden: boolean;
  sysMenuLangs: RSysMenuLangDto[];
  children: RSysMenuAclDto[];
  sysMenuId: number;
  sysGroupId: number;
  aclActions: string[] | null;
  isActive: boolean;
}

export interface RAuthDto {
  sysUser: RSysUserDto;
  sysMenuAcls: RSysMenuAclDto[];
  accessToken: string;
}

export interface LoginAuthDto {
  username: string;
  password: string;
}

export interface RNonDataDto {
  /** @default true */
  success: boolean;
  message: string;
  meta: RMetaNonDataDto;
}

export interface CSysUserProfileFullNameDto {
  firstName: string;
  lastName?: string;
}

export interface CSysUserProfileDto {
  fullName: CSysUserProfileFullNameDto;
  gender?: 'male' | 'female';
  birthDate?: string;
  birthPlace?: string;
  /** @maxLength 50 */
  emailSecondary?: string;
  /** @pattern PATTERN_MOBILE_NUMBER */
  mobileNumberSecondary?: string;
  lang?: 'en' | 'id';
  avatarUrl?: string;
  signatureUrl?: string;
}

export interface RegistrationAuthDto {
  /**
   *
   *     * minLength: 4
   *     * maxLength: 20
   *
   * @minLength 4
   * @maxLength 20
   */
  name: string;
  /**
   *
   *     * minLength: 8
   *     * maxLength: 255
   *
   * @minLength 8
   * @maxLength 255
   */
  password: string;
  /**
   *
   *     * matches: password
   *
   */
  confirmPassword: string;
  /**
   *
   *     * maxLength: 50
   *
   * @maxLength 50
   */
  email: string;
  /**
   *
   *     * pattern: PATTERN_MOBILE_NUMBER
   *
   * @pattern PATTERN_MOBILE_NUMBER
   */
  mobileNumber?: string;
  /**
   *
   *     * allowExtensions: jpeg/jpg/png/gif/webp/tiff/bmp/svg
   *     * maxSize: 2000000 Bytes
   *
   * @format binary
   */
  file?: File;
  /**
   *
   *     * allowExtensions: jpeg/jpg/png/gif/webp/tiff/bmp/svg
   *     * maxSize: 2000000 Bytes
   *
   * @format binary
   */
  signature?: File;
  profile: CSysUserProfileDto;
}

export interface LoginAzureAuthDto {
  accessToken: string;
}

export interface RAuthRefreshTokenDto {
  accessToken: string;
}

export interface RMetaNonDataDto {
  status: string;
  statusCode: number;
  responseSpeed: string;
  serverTime: string;
  path: string;
  lang: string;
  activityUuid: string;
}

export interface RMetaDataDto {
  status: string;
  statusCode: number;
  responseSpeed: string;
  serverTime: string;
  path: string;
  lang: string;
  activityUuid: string;
  dataCount: number;
}

export interface CPeruriUserDto {
  /**
   *
   *       * allowExtensions: jpeg/jpg/png/gif/webp/tiff/bmp/svg
   *       * maxSize: 2000000
   *
   * @format binary
   */
  ktpFile: File;
  /**
   *
   *       * allowExtensions: jpeg/jpg/png/gif/webp/tiff/bmp/svg
   *       * maxSize: 2000000
   *
   * @format binary
   */
  npwpFile?: File;
  /**
   * @minLength 16
   * @maxLength 16
   */
  ktp: string;
  /** @maxLength 16 */
  npwp?: string;
  province: string;
  city: string;
  address: string;
  orgUnit?: string;
  workUnit?: string;
  position?: string;
}

export interface CSysUserDto {
  /**
   *
   *     * minLength: 4
   *     * maxLength: 20
   *
   * @minLength 4
   * @maxLength 20
   */
  name: string;
  /**
   *
   *     * minLength: 8
   *     * maxLength: 255
   *
   * @minLength 8
   * @maxLength 255
   */
  password: string;
  /**
   *
   *     * matches: password
   *
   */
  confirmPassword: string;
  /**
   *
   *     * maxLength: 50
   *
   * @maxLength 50
   */
  email: string;
  /**
   *
   *     * pattern: PATTERN_MOBILE_NUMBER
   *
   * @pattern PATTERN_MOBILE_NUMBER
   */
  mobileNumber?: string;
  /**
   *
   *     * allowExtensions: jpeg/jpg/png/gif/webp/tiff/bmp/svg
   *     * maxSize: 2000000 Bytes
   *
   * @format binary
   */
  file?: File;
  /**
   *
   *     * allowExtensions: jpeg/jpg/png/gif/webp/tiff/bmp/svg
   *     * maxSize: 2000000 Bytes
   *
   * @format binary
   */
  signature?: File;
  sysGroupId?: number;
  isActive?: boolean;
  profile: CSysUserProfileDto;
  peruriUser?: CPeruriUserDto;
}

export interface CManySysUserDto {
  items: CSysUserDto[];
}

export interface RMetaLinkPageDto {
  first: string;
  previous: string;
  next: string;
  last: string;
}

export interface RMetaPaginationDto {
  itemFound: number;
  itemTotal: number;
  itemPerPage: number;
  totalPage: number;
  currentPage: number;
  linkPage: RMetaLinkPageDto;
}

export interface RMetaDataPaginatedDto {
  status: string;
  statusCode: number;
  responseSpeed: string;
  serverTime: string;
  path: string;
  lang: string;
  activityUuid: string;
  dataCount: number;
  pagination?: RMetaPaginationDto;
}

export interface RDataPaginatedDto {
  /** @default true */
  success: boolean;
  message: string;
  meta: RMetaDataPaginatedDto;
}

export interface USysUserProfileFullNameDto {
  firstName?: string;
  lastName?: string;
}

export interface USysUserProfileDto {
  fullName?: USysUserProfileFullNameDto;
  gender?: 'male' | 'female';
  birthDate?: string;
  birthPlace?: string;
  /** @maxLength 50 */
  emailSecondary?: string;
  /** @pattern PATTERN_MOBILE_NUMBER */
  mobileNumberSecondary?: string;
  lang?: 'en' | 'id';
  avatarUrl?: string;
  signatureUrl?: string;
}

export interface USysUserDto {
  /**
   *
   *     * minLength: 8
   *     * maxLength: 255
   *
   * @minLength 8
   * @maxLength 255
   */
  password?: string;
  /**
   *
   *     * matches: password
   *
   */
  confirmPassword?: string;
  /**
   *
   *     * maxLength: 50
   *
   * @maxLength 50
   */
  email?: string;
  /**
   *
   *     * pattern: PATTERN_MOBILE_NUMBER
   *
   * @pattern PATTERN_MOBILE_NUMBER
   */
  mobileNumber?: string;
  /**
   *
   *     * allowExtensions: jpeg/jpg/png/gif/webp/tiff/bmp/svg
   *     * maxSize: 2000000 Bytes
   *
   * @format binary
   */
  file?: File;
  /**
   *
   *     * allowExtensions: jpeg/jpg/png/gif/webp/tiff/bmp/svg
   *     * maxSize: 2000000 Bytes
   *
   * @format binary
   */
  signature?: File;
  profile?: USysUserProfileDto;
  oldPassword?: string;
  sysGroupId?: number;
  isActive?: boolean;
  peruriUser?: CPeruriUserDto;
}

export type KeyUuidDto = object;

export interface U2SysUserDto {
  /**
   *
   *     * minLength: 8
   *     * maxLength: 255
   *
   * @minLength 8
   * @maxLength 255
   */
  password?: string;
  /**
   *
   *     * matches: password
   *
   */
  confirmPassword?: string;
  /**
   *
   *     * pattern: PATTERN_MOBILE_NUMBER
   *
   * @pattern PATTERN_MOBILE_NUMBER
   */
  mobileNumber?: string;
  /**
   *
   *     * allowExtensions: jpeg/jpg/png/gif/webp/tiff/bmp/svg
   *     * maxSize: 2000000 Bytes
   *
   * @format binary
   */
  file?: File;
  /**
   *
   *     * allowExtensions: jpeg/jpg/png/gif/webp/tiff/bmp/svg
   *     * maxSize: 2000000 Bytes
   *
   * @format binary
   */
  signature?: File;
  sysGroupId?: number;
  isActive?: boolean;
  peruriUser?: CPeruriUserDto;
  oldPassword?: string;
}

export interface UManySysUserDto {
  items: KeyUuidDto[];
  /** @default false */
  recover?: boolean;
  data?: U2SysUserDto;
}

export interface URSysUserDto {
  /**
   *
   *     * minLength: 8
   *     * maxLength: 255
   *
   * @minLength 8
   * @maxLength 255
   */
  password?: string;
  /**
   *
   *     * matches: password
   *
   */
  confirmPassword?: string;
  /**
   *
   *     * maxLength: 50
   *
   * @maxLength 50
   */
  email?: string;
  /**
   *
   *     * pattern: PATTERN_MOBILE_NUMBER
   *
   * @pattern PATTERN_MOBILE_NUMBER
   */
  mobileNumber?: string;
  /**
   *
   *     * allowExtensions: jpeg/jpg/png/gif/webp/tiff/bmp/svg
   *     * maxSize: 2000000 Bytes
   *
   * @format binary
   */
  file?: File;
  /**
   *
   *     * allowExtensions: jpeg/jpg/png/gif/webp/tiff/bmp/svg
   *     * maxSize: 2000000 Bytes
   *
   * @format binary
   */
  signature?: File;
  sysGroupId?: number;
  isActive?: boolean;
  peruriUser?: CPeruriUserDto;
  profile?: USysUserProfileDto;
  oldPassword?: string;
}

export interface URManySysUserDto {
  items: URSysUserDto[];
}

export interface DManySysUserDto {
  items: KeyUuidDto[];
}

export interface GetManySysUserResponseDto {
  data: SysUser[];
}

export type SysUser = object;

export interface RSysApiKeyDto {
  id: number;
  uuid: string;
  name: string;
  description: string;
  key: string;
  sysDate: RSysDateDto;
}

export interface CSysApiKeyDto {
  /**
   *
   *     * maxLength: 50
   *
   * @maxLength 50
   */
  name: string;
  /**
   *
   *     * maxLength: 255
   *
   * @maxLength 255
   */
  description: string;
}

export interface CManySysApiKeyDto {
  items: CSysApiKeyDto[];
}

export interface USysApiKeyDto {
  /**
   *
   *     * maxLength: 50
   *
   * @maxLength 50
   */
  name?: string;
  /**
   *
   *     * maxLength: 255
   *
   * @maxLength 255
   */
  description?: string;
}

export interface U2SysApiKeyDto {
  /**
   *
   *     * maxLength: 50
   *
   * @maxLength 50
   */
  name?: string;
  /**
   *
   *     * maxLength: 255
   *
   * @maxLength 255
   */
  description?: string;
}

export interface UManySysApiKeyDto {
  items: KeyUuidDto[];
  /** @default false */
  recover?: boolean;
  data?: U2SysApiKeyDto;
}

export interface DManySysApiKeyDto {
  items: KeyUuidDto[];
}

export interface GetManySysApiKeyResponseDto {
  data: SysApiKey[];
}

export type SysApiKey = object;

export interface RSysMenuDto {
  id: number;
  uuid: string;
  name: string;
  parentId: number | null;
  linkType: string;
  linkTarget: string;
  url: string;
  path: string;
  actions: string[] | null;
  orderNumber: number | null;
  iconCls: string | null;
  isHidden: boolean;
  sysMenuLangs: RSysMenuLangDto[];
  children: RSysMenuDto[];
}

export interface CSysMenuLangDto {
  /**
   * @minLength 2
   * @maxLength 4
   */
  sysLangId: string;
  /**
   * @minLength 2
   * @maxLength 255
   */
  description: string;
}

export interface CSysMenuDto {
  parentId?: number;
  /**
   * @minLength 2
   * @maxLength 50
   */
  name: string;
  linkType?: 'internal' | 'external';
  linkTarget?: 'self' | '_blank';
  isHidden?: boolean;
  /** @maxLength 50 */
  path?: string;
  /** @maxLength 50 */
  url?: string;
  /**
   * @minLength 1
   * @maxLength 50
   */
  iconCls?: string;
  actions?: string[];
  sysMenuLangs: CSysMenuLangDto[];
}

export interface USysMenuDto {
  /**
   * @minLength 2
   * @maxLength 50
   */
  name?: string;
  linkType?: 'internal' | 'external';
  linkTarget?: 'self' | '_blank';
  isHidden?: boolean;
  /** @maxLength 50 */
  path?: string;
  /** @maxLength 50 */
  url?: string;
  /**
   * @minLength 1
   * @maxLength 50
   */
  iconCls?: string;
  actions?: string[];
  sysMenuLangs?: CSysMenuLangDto[];
}

export interface URSysMenuDto {
  /**
   * @minLength 2
   * @maxLength 50
   */
  name?: string;
  linkType?: 'internal' | 'external';
  linkTarget?: 'self' | '_blank';
  isHidden?: boolean;
  /** @maxLength 50 */
  path?: string;
  /** @maxLength 50 */
  url?: string;
  /**
   * @minLength 1
   * @maxLength 50
   */
  iconCls?: string;
  actions?: string[];
  sysMenuLangs?: CSysMenuLangDto[];
  orderNumber?: number;
}

export interface URManySysMenuDto {
  items: URSysMenuDto[];
  parentId?: number;
}

export interface RSysMenuAclActionsDto {
  keyword: string;
  value: boolean;
}

export interface RSysMenuAclSimpleDto {
  id: number;
  uuid: string;
  sysMenuId: number;
  sysGroupId: number;
  actions: string[] | null;
  isActive: boolean;
}

export interface USysMenuAclDto {
  isActive?: boolean;
  actions?: string[];
}

export interface RMeDto {
  sysUser: RSysUserDto;
  sysMenuAcls: RSysMenuAclDto[];
}

export interface RSysNotifCategorytSimpleDto {
  id: number;
  uuid: string;
  name: string;
  description: string;
  initialName: string;
  isGlobal: boolean;
  isManual: boolean;
}

export interface RSysNotifHeaderReadDto {
  id: number;
  sysUserId: number;
  headerId: number;
  readAt: number;
}

export interface RSysDate2Dto {
  createdAt: number;
  createdBy: string;
  updatedAt: number | null;
  updatedBy: string | null;
}

export interface RSysNotifHeaderDto {
  id: number;
  uuid: string;
  title: string;
  contentText: string;
  fromName: string;
  fromInitial: string;
  fromAvatarUrl: string;
  toName: string;
  toSalutation: string;
  detailPath: string;
  detailUid: string;
  imageUrl: string;
  sysUserId: number;
  sysUserName: string;
  categoryId: number;
  moduleId: number;
  moduleName: string;
  category: RSysNotifCategorytSimpleDto;
  headerRead: RSysNotifHeaderReadDto;
  sysDate: RSysDate2Dto;
}

export interface CSysNotifHeaderReadDto {
  headerId: number;
}

export interface GetManyHeaderResponseDto {
  data: Header[];
}

export type Header = object;

export interface RSysNotifLogDto {
  id: number;
  uuid: string;
  title: string;
  contentHtml: string;
  contentText: string;
  contentTextShort: string;
  contentTextWa: string;
  fromName: string;
  fromInitial: string;
  fromAvatarUrl: string;
  attachments?: string[];
  notifChannels: string[];
  categoryId: number;
  category: RSysNotifCategorytSimpleDto;
  toUserIds: number[];
  toUserGroupIds: number[];
  totalRecipient?: number;
  totalRecipientValid?: number;
  queueProgress?: number;
  queueStatus?: string;
  queueStatusMessage?: string;
  sysDate: RSysDate2Dto;
}

export interface CSysNotifLogDto {
  /**
   *
   *     * minLength: 2
   *     * maxLength: 255
   *
   * @minLength 2
   * @maxLength 255
   */
  title: string;
  /**
   *
   *     * notifChannels:
   *       header, email, whatsApp, pushWeb, pushOnesignal, sms
   */
  notifChannels: string[];
  /**
   *
   *     AllowedMimeTypes:
   *     * Images:
   *       image/jpeg, image/jpeg, image/png, image/gif, image/webp, image/tiff, image/bmp, image/svg+xml
   *     * Documents:
   *       application/pdf, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-powerpoint, application/vnd.openxmlformats-officedocument.presentationml.presentation, application/vnd.oasis.opendocument.text, application/vnd.oasis.opendocument.spreadsheet, application/rtf
   *     * Texts:
   *       text/plain, text/markdown, text/csv
   *     * Archives:
   *       application/zip, application/gzip, application/x-bzip2, application/x-tar, application/x-7z-compressed
   *     * Videos:
   *       video/mp4, video/x-matroska, video/avi, video/mpeg, video/webm, video/quicktime, video/3gpp
   *     * Audios:
   *       audio/mpeg, audio/wav, audio/ogg, audio/flac, audio/aac, audio/x-ms-wma
   *
   * @format binary
   */
  files?: any[];
  contentHtml: string;
  contentText: string;
  contentTextShort: string;
  contentTextWa: string;
  detailPath?: string;
  detailUid?: string;
  detailUrl?: string;
  categoryId: number;
  toUserIds: number[];
  toUserGroupIds: number[];
  ccEmails: string[];
  bccEmails: string[];
}

export interface DManySysNotifLogDto {
  items: KeyUuidDto[];
}

export interface GetManyLogResponseDto {
  data: Log[];
}

export type Log = object;

export interface RSysNotifLogRecipientDto {
  id: number;
  uuid: string;
  logId: number;
  sysUserId: number;
  sysUserName: string;
  toName: string;
  toSalutation: string;
  toEmails?: string[];
  emailStatus?: string;
  emailStatusMessage?: string;
  toNumber?: string;
  whatsAppStatus?: string;
  whatsAppStatusMessage?: string;
  toExternalId?: string;
  pushOnesignalStatus?: string;
  pushOnesignalStatusMessage?: string;
  pushWebStatus?: string;
  pushWebStatusMessage?: string;
  headerStatus?: string;
  headerStatusMessage?: string;
  sysDate: RSysDate2Dto;
}

export interface GetManyLogRecipientResponseDto {
  data: LogRecipient[];
}

export type LogRecipient = object;

export interface RSysNotifTemplateDto {
  id: number;
  uuid: string;
  name: string;
  title: string;
  contentHtml: string;
  contentText: string;
  contentTextWa: string;
  detailPath: string;
  categoryId: number;
  category: RSysNotifCategorytSimpleDto;
  sysDate: RSysDate2Dto;
}

export interface CSysNotifTemplateDto {
  /**
   * @minLength 2
   * @maxLength 50
   */
  name: string;
  /**
   * @minLength 2
   * @maxLength 255
   */
  title: string;
  contentHtml: string;
  contentText: string;
  contentTextWa: string;
  detailPath: string;
  categoryId: number;
}

export interface USysNotifTemplateDto {
  /**
   * @minLength 2
   * @maxLength 255
   */
  title?: string;
  contentHtml?: string;
  contentText?: string;
  contentTextWa?: string;
  detailPath?: string;
  categoryId?: number;
}

export interface DManySysNotifTemplateDto {
  items: KeyUuidDto[];
}

export interface GetManyTemplateResponseDto {
  data: Template[];
}

export type Template = object;

export interface RSysNotifCategoryDto {
  id: number;
  uuid: string;
  name: string;
  description: string;
  initialName: string;
  isGlobal: boolean;
  isManual: boolean;
  sysDate: RSysDate2Dto;
}

export interface CSysNotifCategoryDto {
  /**
   * @minLength 2
   * @maxLength 50
   */
  name: string;
  /**
   * @minLength 2
   * @maxLength 255
   */
  description: string;
  /** @default false */
  isGlobal?: boolean;
  /** @default false */
  isManual?: boolean;
}

export interface USysNotifCategoryDto {
  /**
   * @minLength 2
   * @maxLength 255
   */
  description?: string;
  /** @default false */
  isGlobal?: boolean;
  /** @default false */
  isManual?: boolean;
}

export interface DManySysNotifCategoryDto {
  items: KeyUuidDto[];
}

export interface GetManyCategoryResponseDto {
  data: Category[];
}

export type Category = object;

export interface HealthStatusDto {
  status: string;
}

export interface RGlobalHealthDto {
  pingTest: HealthStatusDto;
  database: HealthStatusDto;
  redis: HealthStatusDto;
  scheduler: HealthStatusDto;
  notification_template_category: HealthStatusDto;
  memoryHeap: HealthStatusDto;
}

export interface RSysLangDto {
  id: string;
  name: string;
  iconName: string;
}

export interface RSysGroupParentSimpleDto {
  id: number;
  uuid: string;
  name: string;
  description: string;
}

export interface RGlobalConfigDto {
  sysLangs: RSysLangDto[];
  sysGroupParents: RSysGroupParentSimpleDto[];
  sysConfigs: string;
}

export interface CUSysLangDto {
  /**
   * @minLength 2
   * @maxLength 4
   */
  id: string;
  name: string;
  iconName: string;
}

export interface RSysConfigDto {
  keyword: string;
  value: string;
  valueType: string;
  description: string;
  orderNumber: number;
  isPublic: boolean;
  sysConfigCategoryId: number;
  sysDate: RSysDateDto;
}

export interface CUSysConfigDto {
  /**
   * @minLength 2
   * @maxLength 50
   */
  keyword: string;
  value: string;
  valueType?:
    | 'string'
    | 'number'
    | 'decimal'
    | 'boolean'
    | 'object'
    | 'stringDate'
    | 'file'
    | 'arrayString'
    | 'arrayNumber'
    | 'arrayDecimal'
    | 'arrayBoolean'
    | 'arrayObject'
    | 'arrayStringDate'
    | 'arrayFile';
  /**
   * @minLength 2
   * @maxLength 255
   */
  description?: string;
  isPublic?: boolean;
  orderNumber?: number;
  sysConfigCategoryId?: number;
}

export interface CUManySysConfigDto {
  items: CUSysConfigDto[];
}

export interface DKeySysConfigDto {
  /**
   * @minLength 2
   * @maxLength 50
   */
  keyword?: string;
}

export interface DManySysConfigDto {
  items: DKeySysConfigDto[];
}

export interface GetManySysConfigResponseDto {
  data: SysConfig[];
}

export type SysConfig = object;

export interface RSysConfigCategoryDto {
  id: number;
  uuid: string;
  name: string;
  description: string;
  sysConfigs: RSysConfigDto[];
  sysDate: RSysDateDto;
}

export interface CSysConfigCategoryChildDto {
  /**
   * @minLength 2
   * @maxLength 50
   */
  keyword: string;
  value: string;
  valueType?:
    | 'string'
    | 'number'
    | 'decimal'
    | 'boolean'
    | 'object'
    | 'stringDate'
    | 'file'
    | 'arrayString'
    | 'arrayNumber'
    | 'arrayDecimal'
    | 'arrayBoolean'
    | 'arrayObject'
    | 'arrayStringDate'
    | 'arrayFile';
  /**
   * @minLength 2
   * @maxLength 255
   */
  description?: string;
  isPublic?: boolean;
  orderNumber?: number;
}

export interface CSysConfigCategoryDto {
  /**
   * @minLength 2
   * @maxLength 50
   */
  name: string;
  /**
   * @minLength 2
   * @maxLength 255
   */
  description: string;
  sysConfigs: CSysConfigCategoryChildDto[];
}

export interface USysConfigCategoryChilDto {
  id?: number;
  uuid?: number;
  /**
   * @minLength 2
   * @maxLength 50
   */
  keyword?: string;
  value?: string;
  valueType?:
    | 'string'
    | 'number'
    | 'decimal'
    | 'boolean'
    | 'object'
    | 'stringDate'
    | 'file'
    | 'arrayString'
    | 'arrayNumber'
    | 'arrayDecimal'
    | 'arrayBoolean'
    | 'arrayObject'
    | 'arrayStringDate'
    | 'arrayFile';
  /**
   * @minLength 2
   * @maxLength 255
   */
  description?: string;
  isPublic?: boolean;
  orderNumber?: number;
  sysConfigCategoryId?: number;
}

export interface USysConfigCategoryDto {
  sysConfigs: USysConfigCategoryChilDto[];
  /**
   * @minLength 2
   * @maxLength 50
   */
  name?: string;
  /**
   * @minLength 2
   * @maxLength 255
   */
  description?: string;
}

export interface DManySysConfigCategoryDto {
  items: KeyUuidDto[];
}

export interface GetManySysConfigCategoryResponseDto {
  data: SysConfigCategory[];
}

export type SysConfigCategory = object;

export interface RSysGroupDto {
  id: number;
  uuid: string;
  name: string;
  description: string;
  sysGroupParentId: number;
  role?: string;
  sysDate: RSysDateDto;
}

export interface CSysGroupDto {
  /**
   * @minLength 2
   * @maxLength 50
   */
  name: string;
  /**
   * @minLength 2
   * @maxLength 255
   */
  description: string;
  sysGroupParentId: number;
}

export interface CManySysGroupDto {
  items: CSysGroupDto[];
}

export interface USysGroupDto {
  /**
   * @minLength 2
   * @maxLength 255
   */
  description?: string;
  sysGroupParentId?: number;
}

export interface U2SysGroupDto {
  /**
   * @minLength 2
   * @maxLength 255
   */
  description?: string;
  sysGroupParentId?: number;
}

export interface UManySysGroupDto {
  items: KeyUuidDto[];
  /** @default false */
  recover?: boolean;
  data?: U2SysGroupDto;
}

export interface URSysGroupDto {
  /**
   * @minLength 2
   * @maxLength 255
   */
  description?: string;
  sysGroupParentId?: number;
}

export interface URManySysGroupDto {
  items: URSysGroupDto[];
}

export interface DManySysGroupDto {
  items: KeyUuidDto[];
}

export interface GetManySysGroupResponseDto {
  data: SysGroup[];
}

export type SysGroup = object;

export interface RSysGroupParentDto {
  id: number;
  uuid: string;
  name: string;
  description: string;
  sysGroupChildren: RSysGroupDto[];
  sysDate: RSysDateDto;
}

export interface CSysGroupParentChilDto {
  /**
   * @minLength 2
   * @maxLength 50
   */
  name: string;
  /**
   * @minLength 2
   * @maxLength 255
   */
  description: string;
}

export interface CSysGroupParentDto {
  /**
   * @minLength 2
   * @maxLength 50
   */
  name: string;
  /**
   * @minLength 2
   * @maxLength 255
   */
  description: string;
  sysGroupChildren: CSysGroupParentChilDto[];
}

export interface USysGroupParentChilDto {
  id?: number;
  uuid?: number;
  /**
   * @minLength 2
   * @maxLength 50
   */
  name?: string;
  /**
   * @minLength 2
   * @maxLength 255
   */
  description?: string;
  sysGroupParentId?: number;
}

export interface USysGroupParentDto {
  sysGroupChildren: USysGroupParentChilDto[];
  /**
   * @minLength 2
   * @maxLength 255
   */
  description?: string;
}

export interface DManySysGroupParentDto {
  items: KeyUuidDto[];
}

export interface GetManySysGroupParentResponseDto {
  data: SysGroupParent[];
}

export type SysGroupParent = object;

export interface RSysSchedulerDto {
  id: number;
  uuid: string;
  name: string;
  isActive: boolean;
  cronType: string;
  cronExpression: string;
  cronDescription: string;
  cmdFuncPathUrl: string;
  lastExecutionStatus: boolean;
  lastExecutionLog: string;
  /** @format date-time */
  lastExecutionAt: string;
  /** @format date-time */
  nextExecutionAt: string;
  sysDate: RSysDateDto;
}

export interface CSysSchedulerDto {
  /**
   * @minLength 2
   * @maxLength 50
   */
  name: string;
  /** @default true */
  isActive?: boolean;
  cronType:
    | 'InternalFunc'
    | 'AccessUrl'
    | 'ShellScript'
    | 'BackupDB'
    | 'BackupUploadDir';
  cronExpression: string;
  cmdFuncPathUrl?: string;
}

export interface USysSchedulerDto {
  /**
   * @minLength 2
   * @maxLength 50
   */
  name?: string;
  /** @default true */
  isActive?: boolean;
  cronType?:
    | 'InternalFunc'
    | 'AccessUrl'
    | 'ShellScript'
    | 'BackupDB'
    | 'BackupUploadDir';
  cronExpression?: string;
  cmdFuncPathUrl?: string;
}

export interface DManySysSchedulerDto {
  items: KeyUuidDto[];
}

export interface RSysCalendarTagDto {
  id: number;
  uuid: string;
  name: string;
  colorHex?: string;
  textColorHex?: string;
  isAllowEdit?: boolean;
}

export interface RSysCalendarDto {
  id: number;
  uuid: string;
  title: string;
  description: string;
  start: string;
  end: string;
  tag: RSysCalendarTagDto;
  gcId: string;
}

export interface CSysCalendarDto {
  /**
   * @minLength 2
   * @maxLength 100
   */
  title: string;
  description?: string;
  start: string;
  end: string;
  sysCalendarTagId?: number;
  gcId?: string;
}

export interface CManySysCalendarDto {
  items: CSysCalendarDto[];
}

export interface USysCalendarDto {
  /**
   * @minLength 2
   * @maxLength 100
   */
  title?: string;
  description?: string;
  start?: string;
  end?: string;
  sysCalendarTagId?: number;
  gcId?: string;
}

export interface DManySysCalendarDto {
  items: KeyUuidDto[];
}

export interface GetManySysCalendarResponseDto {
  data: SysCalendar[];
}

export type SysCalendar = object;

export interface CSysCalendarTagDto {
  /**
   * @minLength 2
   * @maxLength 100
   */
  name: string;
  /**
   * @minLength 2
   * @maxLength 10
   */
  colorHex: string;
  /**
   * @minLength 2
   * @maxLength 10
   */
  textColorHex: string;
}

export interface CManySysCalendarTagDto {
  items: CSysCalendarTagDto[];
}

export interface USysCalendarTagDto {
  /**
   * @minLength 2
   * @maxLength 10
   */
  colorHex?: string;
  /**
   * @minLength 2
   * @maxLength 10
   */
  textColorHex?: string;
}

export interface DManySysCalendarTagDto {
  items: KeyUuidDto[];
}

export interface GetManySysCalendarTagResponseDto {
  data: SysCalendarTag[];
}

export type SysCalendarTag = object;

export interface RRegionProvinceDto {
  id: number;
  uuid: string;
  code: string;
  name: string;
  sysDate: RSysDateDto;
}

export interface RRegionRegencyDto {
  id: number;
  uuid: string;
  code: string;
  name: string;
  provinceId: number;
  sysDate: RSysDateDto;
}

export interface RRegionDistrictDto {
  id: number;
  uuid: string;
  code: string;
  name: string;
  regencyId: number;
  sysDate: RSysDateDto;
}

export interface RRegionVillageDto {
  id: number;
  uuid: string;
  code: string;
  name: string;
  district: RRegionDistrictDto;
  districtId: number;
  sysDate: RSysDateDto;
}

export interface RSapDto {
  id: number;
  uuid: string;
  name: string;
  endpoint: string;
  tableSync: string;
  lastSyncTotal: number;
  lastSyncAt: number;
  sysDate: RSysDateDto;
}

export interface CSapDto {
  /**
   * @minLength 2
   * @maxLength 50
   */
  name: string;
  /**
   * @minLength 2
   * @maxLength 50
   */
  endpoint: string;
  /**
   * @minLength 2
   * @maxLength 50
   */
  tableSync: string;
}

export interface USapDto {
  /**
   * @minLength 2
   * @maxLength 50
   */
  endpoint?: string;
  /**
   * @minLength 2
   * @maxLength 50
   */
  tableSync?: string;
}

export interface DManySapDto {
  items: KeyUuidDto[];
}

export interface GetManySapResponseDto {
  data: Sap[];
}

export type Sap = object;

export interface RSapPenyerapanPoDto {
  id?: number;
  poNumber: string;
  documentType: string;
  lastChangeDate: string;
  documentDate: string;
  companyCode: string;
  vendorNumber: string;
  purchasingOrganization: string;
  purchasingGroup: string;
  releaseIndicator: string;
  profitCenter?: string;
  customerNumber?: string;
  currencyPo: string;
  netOrderValue?: number;
  currency: string;
  amountInDocCurrency?: number;
  headerCurrency: string;
  amountInLocalCurrency?: number;
  vendorName: string;
  paymentTerms?: string;
  startDate?: string;
  endDate?: string;
  incoterms: string;
  additionalIncoterms: string;
  contractNumber?: string;
  contractText?: string;
  contractDateText?: string;
  manualReferenceText?: string;
  sysDate: RSysDateDto;
}

export interface GetManySapPenyerapanPoResponseDto {
  data: SapPenyerapanPo[];
}

export type SapPenyerapanPo = object;

export interface RSapPoDetailDto {
  id: number;
  identity: string;
  poNumber: string;
  poItem: string;
  documentType: string;
  vendorNumber: string;
  vendorName: string;
  postingDatePo: string;
  documentDatePo: string;
  exchangeRate: number;
  fixedExchangeRateIndicator: string;
  returnPercentage: number;
  purchasingGroup: string;
  releaseIndicator: string;
  profitCenter: string;
  customerNumber: string;
  poReferenceText: string;
  incoterms: string;
  additionalIncoterms: string;
  contractStartDate: string;
  contractEndDate: string;
  itemType: string;
  currency: string;
  netPricePerUnit: number;
  netPriceTotal: number;
  materialNumber: string;
  itemDescription: string;
  quantity: number;
  unit: string;
  packageNumber: string;
  relatedPackageNumber: string;
  externalServicePackageNumber: string;
  externalServicePositionNumber: string;
  additionalText: string;
  externalServiceQuantity: number;
  externalServiceUnit: string;
  externalServiceTotalValue: number;
  externalServiceGrossValue: number;
  sysDate: RSysDateDto;
}

export interface GetManySapPoDetailResponseDto {
  data: SapPoDetail[];
}

export type SapPoDetail = object;

export interface RMantappDto {
  id: number;
  uuid: string;
  name: string;
  endpoint: string;
  tableSync: string;
  lastSyncTotal: number;
  lastSyncAt: number;
  sysDate: RSysDateDto;
}

export interface CMantappDto {
  /**
   * @minLength 2
   * @maxLength 50
   */
  name: string;
  /**
   * @minLength 2
   * @maxLength 50
   */
  endpoint: string;
  /**
   * @minLength 2
   * @maxLength 50
   */
  tableSync: string;
}

export interface UMantappDto {
  /**
   * @minLength 2
   * @maxLength 50
   */
  endpoint?: string;
  /**
   * @minLength 2
   * @maxLength 50
   */
  tableSync?: string;
}

export interface DManyMantappDto {
  items: KeyUuidDto[];
}

export interface GetManyMantappResponseDto {
  data: Mantapp[];
}

export type Mantapp = object;

export interface RMantappBusinessUnitDto {
  id: number;
  code: string;
  name: string;
  companyId: number;
  companyName: string;
  sysDate: RSysDateDto;
}

export interface GetManyMantappBusinessUnitResponseDto {
  data: MantappBusinessUnit[];
}

export type MantappBusinessUnit = object;

export type MantappCompany = object;

export interface RMantappDivisionDto {
  id: number;
  code: string;
  name: string;
  businessUnitId: number;
  businessUnitName: string;
  company: MantappCompany;
  sysDate: RSysDateDto;
}

export interface GetManyMantappDivisionResponseDto {
  data: MantappDivision[];
}

export type MantappDivision = object;

export interface RMantappDepartmentDto {
  id: number;
  code: string;
  name: string;
  divisionId: number;
  divisionName: string;
  businessUnit: RMantappBusinessUnitDto;
  company: MantappCompany;
  sysDate: RSysDateDto;
}

export interface GetManyMantappDepartmentResponseDto {
  data: MantappDepartment[];
}

export type MantappDepartment = object;

export interface RMantappJobInfoEmpDto {
  employeeStatus?: string;
  employeeId?: number;
  employeeNrp?: string;
  employeefullName?: string;
  employeeUserType?: string;
  employeeEmailAddress?: string;
  positionCode?: string;
  positionName?: string;
  companyCode?: string;
  companyName?: string;
  businessUnitCode?: string;
  businessUnitName?: string;
  divisionCode?: string;
  divisionName?: string;
  projectCode?: string[];
  departmentCode?: string;
  departmentName?: string;
  subDepartmentCode?: string;
  subDepartmentName?: string;
  sectionCode?: string;
  sectionName?: string;
  locationCode?: string;
  locationName?: string;
  costCenterCode?: string;
  costCenterName?: string;
  payGradeCode?: string;
}

export interface RMantappEmployeeDto {
  id: number;
  personId: string;
  fullName: string;
  firstName: string;
  salutation: string;
  gender: string;
  jobInfo: RMantappJobInfoEmpDto;
  sysDate: RSysDateDto;
}

export interface GetManyMantappEmployeeResponseDto {
  data: MantappEmployee[];
}

export type MantappEmployee = object;

export interface RMantappProjectDivDto {
  id: number;
  name: string;
  businessUnitId: number;
  businessUnitName: string;
}

export interface RMantappProjectDto {
  id: number;
  code: string;
  name: string;
  division: RMantappProjectDivDto;
  company: MantappCompany;
  sysDate: RSysDateDto;
}

export interface GetManyMantappProjectResponseDto {
  data: MantappProject[];
}

export type MantappProject = object;

export interface REprocDto {
  id: number;
  uuid: string;
  name: string;
  endpoint: string;
  tableSync: string;
  lastSyncTotal: number;
  lastSyncAt: number;
  sysDate: RSysDateDto;
}

export interface CEprocDto {
  /**
   * @minLength 2
   * @maxLength 50
   */
  name: string;
  /**
   * @minLength 2
   * @maxLength 50
   */
  endpoint: string;
  /**
   * @minLength 2
   * @maxLength 50
   */
  tableSync: string;
}

export interface UEprocDto {
  /**
   * @minLength 2
   * @maxLength 50
   */
  endpoint?: string;
  /**
   * @minLength 2
   * @maxLength 50
   */
  tableSync?: string;
}

export interface DManyEprocDto {
  items: KeyUuidDto[];
}

export interface AuthVendorEprocDto {
  username: string;
  password: string;
}

export interface GetManyEprocResponseDto {
  data: Eproc[];
}

export type Eproc = object;

export interface REprocContractsDto {
  id?: number;
  contractId: string;
  contractNumber: string;
  contractStatus: string;
  contractDate?: string;
  startDate?: string;
  endDate?: string;
  vendorId: string;
  vendorName: string;
  division: string;
  itemName: string;
  workService: string;
  profitCenter: string;
  isActive: boolean;
  sysDate: RSysDateDto;
}

export interface GetManyEprocContractsResponseDto {
  data: EprocContracts[];
}

export type EprocContracts = object;

export interface REprocVendorsDto {
  id?: number;
  code: string;
  type: string;
  name: string;
  userName: string;
  npwp: string;
  email: string;
  workType: string;
  address: string;
  picEmail: string;
  picName: string;
  picPhone: string;
  sysDate: RSysDateDto;
}

export interface GetManyEprocVendorsResponseDto {
  data: EprocVendors[];
}

export type EprocVendors = object;

export interface UploadDtoVideos5MB {
  /**
   *
   *         * allowExtensions: videos
   *         * maxSize: 5 MB
   *
   * @format binary
   */
  file: File;
}

export interface UploadDtoPngJpgJpeg5MB {
  /**
   *
   *         * allowExtensions: png/jpg/jpeg
   *         * maxSize: 5 MB
   *
   * @format binary
   */
  file: File;
}

export interface RPeruriUserForDocumentDto {
  ktp: string;
  npwp: string;
  specimentFile: string;
  specimentBase64: string;
  orgUnit: string;
  workUnit: string;
  position: string;
  statusCode: string;
  status: string;
}

export interface RSysUserProfileForPeruriDocumentDto {
  fullName: RSysUserProfileFullNameDto;
  gender: string;
}

export interface RSysUserForPeruriDocumentDto {
  peruriUser: RPeruriUserForDocumentDto;
  profile: RSysUserProfileForPeruriDocumentDto;
  id: number;
  uuid: string;
  name: string;
  email: string;
}

export interface RPeruriDocumentSignerDto {
  id: number;
  uuid: string;
  isVisualSign?: string;
  lowerLeftX?: number;
  lowerLeftY?: number;
  upperRightX?: number;
  upperRightY?: number;
  page?: number;
  scale?: number;
  pageWidth?: number;
  pageHeight?: number;
  originalImageWidth?: number;
  originalImageHeight?: number;
  imageAspectRatio?: number;
  style?: string;
  certificateLevel?: string;
  varLocation?: string;
  varReason?: string;
  documentId: number;
  signerId: number;
  signer: RSysUserForPeruriDocumentDto;
  signerIndex: number;
  /** @format date-time */
  signerDatetime?: string;
  signerOrderId?: string;
}

export interface RPeruriDocumentDto {
  id: number;
  uuid: string;
  fileName: string;
  filePath: string;
  filePathDownload: string;
  orderId: number;
  orderIdTier: number;
  orderIdParallel: number;
  password: string;
  currentOrderId: object;
  orderType: string;
  isDefinedCoordinate: boolean;
  isFinishedSetSignature: boolean;
  uploader: RSysUserForPeruriDocumentDto;
  statusDocument: string;
  totalSigner: number;
  signerDocument: RPeruriDocumentSignerDto[];
  sysDate: RSysDateDto;
}

export interface CPeruriDocumentDto {
  /**
   *
   *       * minLength: 4
   *       * maxLength: 20
   *
   * @minLength 4
   * @maxLength 20
   */
  fileName?: string;
  /**
   *
   *       * allowExtensions: pdf/doc/docx/xls/xlsx/ppt/pptx/odt/ods/rtf
   *       * maxSize: 5MB
   *
   * @format binary
   */
  file?: File;
  userIds: number[];
  orderType: 'INDIVIDUAL' | 'PARALLEL' | 'TIER';
  isDefinedCoordinate: boolean;
}

export interface UPeruriSetSignatureDto {
  style?: object;
  isVisualSign: 'YES' | 'NO';
  lowerLeftX: number;
  lowerLeftY: number;
  upperRightX: number;
  upperRightY: number;
  page: number;
  scale?: number;
  pageWidth?: number;
  pageHeight?: number;
  originalImageWidth?: number;
  originalImageHeight?: number;
  imageAspectRatio?: number;
  varLocation: string;
  varReason: string;
  userSignerId: number;
}

export interface UPeruriSetPasswordDto {
  password: string;
}

export interface RPeruriDocumentRequestOtpDto {
  token: string;
  orderType: string;
  documentOrderId: number;
  signerOrderId: number;
}

export interface CPeruriDocumentReqOtpDto {
  sendEmail: number;
  sendSms: number;
}

export interface RPeruriDocumentRequestOtpBulkDto {
  token: string;
  orderIdBulk: string;
  documentOrderIds: number[];
  signerOrderIds: string[];
}

export interface CPeruriDocumentReqOtpBulkDto {
  sendEmail: number;
  sendSms: number;
  items: KeyUuidDto[];
  flagOTAC: number;
}

export interface CPeruriDocumentSigningDto {
  token: string;
  otpCode: string;
}

export interface CPeruriDocumentSigningBulkDto {
  token: string;
  otpCode: string;
  orderIdBulk: string;
}

export interface RPeruriResultDto {
  resultData?: object;
  resultCode: string;
  resultDesc: string;
}

export interface RPeruriDocumentCheckStatusDto {
  responsePeruri?: RPeruriResultDto;
  id: number;
  uuid: string;
  fileName: string;
  filePath: string;
  filePathDownload: string;
  orderId: number;
  orderIdTier: number;
  orderIdParallel: number;
  password: string;
  currentOrderId: object;
  orderType: string;
  isDefinedCoordinate: boolean;
  isFinishedSetSignature: boolean;
  uploader: RSysUserForPeruriDocumentDto;
  statusDocument: string;
  totalSigner: number;
  signerDocument: RPeruriDocumentSignerDto[];
  sysDate: RSysDateDto;
}

export interface GetManyPeruriDocumentResponseDto {
  data: PeruriDocument[];
}

export type PeruriDocument = object;
