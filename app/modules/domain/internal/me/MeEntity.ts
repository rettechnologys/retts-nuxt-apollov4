import {
  RMeDto,
  RSysNotifHeaderDto,
} from '~/modules/data/internal/data-source/data-contracts';

//#region Entity
export type MeEntity = RMeDto;
export type MeNotificationEntity = RSysNotifHeaderDto;
//#endregion Entity

//#region ReqBody
export type UMeNotifHeaderReqBody = {
  headerId: number;
};
//#endregion ReqBody
