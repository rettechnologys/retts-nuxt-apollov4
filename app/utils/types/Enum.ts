export enum ELinkType {
  INTERNAL = 'internal',
  EXTERNAL = 'external',
}

export enum ELinkTarget {
  SELF = 'self',
  BLANK = '_blank',
}

export enum EActions {
  add = 'add',
  edit = 'edit',
  delete = 'delete',
  detail = 'detail',
}

export enum EGender {
  Male = 'male',
  Female = 'female',
}

export enum EGenderID {
  Pria = 'pria',
  Wanita = 'wanita',
}

export enum ESalutation {
  Mr = 'Mr',
  Mrs = 'Mrs',
  MrMrs = 'Mr/Mrs',
}

export enum ESalutationID {
  Bapak = 'Bapak',
  Ibu = 'Ibu',
  BapakIbu = 'Bapak/Ibu',
}

export enum ENotifTypes {
  EMAIL = 'email',
  WHATSAPP = 'whatsApp',
  ONESIGNAL = 'pushOnesignal',
  PUSH_WEB = 'pushWeb',
  HEADER = 'header',
}
export enum ERecipientKind {
  SINGLE = 'single',
  MULTIPLE = 'multiple',
}

export enum EBreakPoint {
  PhoneSM = 576,
  TabletMD = 768,
  NotebookLG = 992,
  DesktopXL = 1200,
}

export enum EBreakPointVW {
  '25vw' = '25vw',
  '50vw' = '50vw',
  '75vw' = '75vw',
  '95vw' = '95vw',
  '100vw' = '100vw',
}

export enum EValueType {
  STRING = 'string',
  NUMBER = 'number',
  BOOLEAN = 'boolean',
  OBJECT = 'object',
  ARRAY_STRING = 'arrayString',
  ARRAY_NUMBER = 'arrayNumber',
  ARRAY_DECIMAL = 'arrayDecimal',
  ARRAY_BOOLEAN = 'arrayBoolean',
  ARRAY_OBJECT = 'arrayObject',
}
export enum ECronType {
  BACKUP_DB = 'BackupDB',
  BACKUP_UPLOAD_DIR = 'BackupUploadDir',
  INTERNAL_FUNC = 'InternalFunc',
  ACCESS_URL = 'AccessUrl',
  SHELL_SCRIPT = 'ShellScript',
}

export enum EMantappSyncModules {
  REF_BUSINESS_UNIT = 'business-unit',
  REF_DIVISION = 'division',
  REF_DEPARTMENT = 'department',
  REF_JOB_TITLE = 'job-title',
  REF_WORK_CONTRACT = 'work-contract',
  HC_JOB_INFO = 'job-info',
  HC_EMPLOYEE = 'employee',
  PROJECT = 'project',
}
export enum ENotificationsOptions {
  GLOBAL = 1,
  USER = 2,
}
