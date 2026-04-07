import { Ploc } from '~/utils/helpers/Ploc';
import { MeUseCase } from '~/modules//domain/internal/me/usecase';
import { useDynamicStore } from '~/stores/DynamicStore';
import { inject, singleton } from 'tsyringe';
import {
  EMeNameState,
  EMeStatusState,
  initialState,
  ME_STATE,
  MeState,
} from './MeState';
import { useAppADStore } from '~/stores/AppADStore.client';

@singleton()
export class MePloc extends Ploc<MeState> {
  constructor(
    @inject('MeUseCase')
    protected meUseCase: MeUseCase,
    //@inject('MeUOnesUseCase')
    //protected meUOnesUseCase: MeUOnesUseCase,
  ) {
    const meStore = useDynamicStore(ME_STATE, initialState);

    super(meStore, true);
  }

  //* Store Me Data
  appADStore = useAppADStore();

  //#region Methods => start with 'p'
  async pMe() {
    const name = `${ME_STATE}${EMeNameState.Me}`;
    const methodName = this.pMe.name;

    this.emitState({
      status: EMeStatusState.FetchWaiting,
      name,
      methodName,
    });

    const response = await this.meUseCase.call();

    response.fold(
      (responseFailure) => {
        this.appADStore.logout(); //* Force Logout on Me Fetch Failure
        this.emitState({
          ...this.state,
          status: EMeStatusState.FetchFailure,
          failureCode: responseFailure.code,
          failureMessage: responseFailure.message,
        });
      },
      async (responseSuccees) => {
        const { ...data } = responseSuccees;

        this.emitState({
          ...this.state,
          status: EMeStatusState.FetchSuccess,
          data,
        });

        //* Store Me Data
        await this.appADStore.setState(responseSuccees);
      },
    );
  }

  /**
   * State Name: MeUpdateOnes
   * State Status: UpdateWaiting | UpdateFailure | UpdateSuccess
   */
  // async pUOnes(reqBody: USysUserReqBody, axiosConfig?: any) {
  //   const name = `${ME_STATE}${EMeNameState.UOnes}`;
  //   const methodName = this.pUOnes.name;

  //   this.emitState({
  //     status: EMeStatusState.UpdateWaiting,
  //     name,
  //     methodName,
  //     reqData: {
  //       reqBody,
  //     },
  //   });

  //   const response = await this.meUOnesUseCase.call(reqBody, axiosConfig);

  //   response.fold(
  //     (responseFailure) => {
  //       this.emitState({
  //         ...this.state,
  //         status: EMeStatusState.UpdateFailure,
  //         failureCode: responseFailure.code,
  //         failureMessage: responseFailure.message,
  //       });
  //     },
  //     (responseSuccees) => {
  //       const { ...data } = responseSuccees;

  //       this.emitState({
  //         ...this.state,
  //         status: EMeStatusState.UpdateSuccess,
  //         data,
  //       });
  //     },
  //   );
  // }
  //#endregion Methods
}
