import { Ploc } from '~/utils/helpers/Ploc';
import {
  MeProfileUAvatarUseCase,
  MeProfileUOnesUseCase,
} from '~/modules//domain/internal/me/me-profile/usecase';
import { USysUserReqBody } from '~/modules//domain/internal/sys/sys-user';
import { useDynamicStore } from '~/stores/DynamicStore';
import { inject, singleton } from 'tsyringe';
import {
  EMeProfileNameState,
  EMeProfileStatusState,
  initialState,
  ME_PROFILE_STATE,
  MeProfileState,
} from './MeProfileState';
import { IReqSingleFile } from '@/utils/types/RequestInternal';

@singleton()
export class MeProfilePloc extends Ploc<MeProfileState> {
  constructor(
    @inject('MeProfileUOnesUseCase')
    protected meProfileUOnesUseCase: MeProfileUOnesUseCase,
    @inject('MeProfileUAvatarUseCase')
    protected meProfileUAvatarUseCase: MeProfileUAvatarUseCase,
  ) {
    const meProfileStore = useDynamicStore(ME_PROFILE_STATE, initialState);

    super(meProfileStore, true);
  }

  //#region MeProfilethods => start with 'p'
  /**
   * State Name: MeProfileUpdateOnes
   * State Status: UpdateWaiting | UpdateFailure | UpdateSuccess
   */
  async pUOnes(reqBody: USysUserReqBody, axiosConfig?: any) {
    const name = `${ME_PROFILE_STATE}${EMeProfileNameState.UOnes}`;
    const methodName = this.pUOnes.name;

    this.emitState({
      status: EMeProfileStatusState.UpdateWaiting,
      name,
      methodName,
      reqData: {
        reqBody,
      },
    });

    const response = await this.meProfileUOnesUseCase.call(
      reqBody,
      axiosConfig,
    );

    response.fold(
      (responseFailure) => {
        this.emitState({
          ...this.state,
          status: EMeProfileStatusState.UpdateFailure,
          failureCode: responseFailure.code,
          failureMessage: responseFailure.message,
        });
      },
      (responseSuccees) => {
        const { ...data } = responseSuccees;

        this.emitState({
          ...this.state,
          status: EMeProfileStatusState.UpdateSuccess,
          data,
        });
      },
    );
  }

  /**
   * State Name: MeProfileUpdateAvatar
   * State Status: UploadWaiting | UploadFailure | UploadSuccess
   */
  async pUAvatar(reqBody: IReqSingleFile, axiosConfig?: any) {
    const name = `${ME_PROFILE_STATE}${EMeProfileNameState.UPOnes}`;
    const methodName = this.pUAvatar.name;

    this.emitState({
      status: EMeProfileStatusState.UploadWaiting,
      name,
      methodName,
      reqData: {
        reqBody,
      },
    });

    const response = await this.meProfileUAvatarUseCase.call(
      reqBody,
      axiosConfig,
    );

    response.fold(
      (responseFailure) => {
        this.emitState({
          ...this.state,
          status: EMeProfileStatusState.UploadFailure,
          failureCode: responseFailure.code,
          failureMessage: responseFailure.message,
        });
      },
      (responseSuccees) => {
        const { ...data } = responseSuccees;

        this.emitState({
          ...this.state,
          status: EMeProfileStatusState.UploadSuccess,
          data,
        });
      },
    );
  }
  //#endregion MeProfilethods
}
