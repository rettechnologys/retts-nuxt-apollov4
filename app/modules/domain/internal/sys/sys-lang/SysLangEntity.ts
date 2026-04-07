import { Expose } from 'class-transformer';
import type {
  CUSysLangDto,
  RSysLangDto,
} from '~/modules/data/internal/data-source/data-contracts';

//#region Entity
export type SysLangEntity = RSysLangDto;
//#endregion Entity

//#region ReqBody
// export type CUSysLangReqBody = CUSysLangDto;
export class CUSysLangReqBody implements CUSysLangDto {
  @Expose()
  id!: string;

  @Expose()
  name!: string;

  @Expose()
  iconName!: string;
}
//#endregion ReqBody