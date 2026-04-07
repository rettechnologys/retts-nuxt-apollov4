import {
  CSysNotifLogDto,
  DManySysNotifLogDto,
  KeyUuidDto,
  RSysNotifLogDto,
} from '~/modules/data/internal/data-source/data-contracts';
import { Expose } from 'class-transformer';

//#region Entity
export type SysNotifManualEntity = RSysNotifLogDto;
//#endregion Entity

//#region ReqBody
// export type DManySysNotifManualReqBody = DManySysNotifManualDto;
export class DManySysNotifManualReqBody implements DManySysNotifLogDto {
  @Expose()
  items: KeyUuidDto[] = [];
}

// export type CSysNotifManualReqBody = CSysNotifManualDto;
export class CSysNotifManualReqBody implements CSysNotifLogDto {
  @Expose()
  detailPath?: string;

  @Expose()
  detailUid?: string;

  @Expose()
  detailUrl?: string;

  @Expose()
  toUserGroupIds: number[] = [];

  @Expose()
  ccEmails: string[] = [];

  @Expose()
  bccEmails: string[] = [];
  
  @Expose()
  title!: string;

  @Expose()
  contentHtml!: string;

  @Expose()
  contentText!: string;

  @Expose()
  contentTextWa!: string;

  @Expose()
  contentTextShort!: string;

  @Expose()
  notifChannels: string[] = [];

  @Expose()
  categoryId!: number;

  @Expose()
  toUserIds: number[] = [];

  files?: File[] | undefined;
}
//#endregion ReqBody
