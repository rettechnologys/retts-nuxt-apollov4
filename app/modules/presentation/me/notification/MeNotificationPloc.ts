import { Ploc } from '~/utils/helpers/Ploc';
import {
  MeNotificationFManysUseCase,
  MeNotificationFOnesUseCase,
  MeNotificationReadUseCase,
} from '~/modules//domain/internal/me/me-notification/usecase';
import { useDynamicStore } from '~/stores/DynamicStore';
import { IReqQuery, IReqUidQuery } from '@/utils/types/RequestInternal';
import { inject, singleton } from 'tsyringe';
import {
  EMeNotificationNameState,
  EMeNotificationStatusState,
  initialState,
  ME_NOTIFICATION_STATE,
  MeNotificationState,
} from './MeNotificationState';

@singleton()
export class MeNotificationPloc extends Ploc<MeNotificationState> {
  constructor(
    @inject('MeNotificationFManysUseCase')
    protected meNotificationFManysUseCase: MeNotificationFManysUseCase,
    @inject('MeNotificationFOnesUseCase')
    protected meNotificationFOnesUseCase: MeNotificationFOnesUseCase,
    @inject('MeNotificationReadUseCase')
    protected meNotificationReadUseCase: MeNotificationReadUseCase,
  ) {
    const meNotificationStore = useDynamicStore(
      ME_NOTIFICATION_STATE,
      initialState,
    );

    super(meNotificationStore, true);
  }

  //#region MeNotificationthods => start with 'p'
  /**
   * State Name: MeNotificationFindManys
   * State Status: FetchWaiting | FetchFailure | FetchSuccess
   */
  async pFManys(query?: IReqQuery) {
    const name = `${ME_NOTIFICATION_STATE}${EMeNotificationNameState.FManys}`;
    const methodName = this.pFManys.name;

    this.emitState({
      status: EMeNotificationStatusState.FetchWaiting,
      name,
      methodName,
      reqData: {
        query,
      },
    });

    const response = await this.meNotificationFManysUseCase.call(query);

    response.fold(
      (responseFailure) => {
        this.emitState({
          ...this.state,
          status: EMeNotificationStatusState.FetchFailure,
          failureCode: responseFailure.code,
          failureMessage: responseFailure.message,
        });
      },
      (responseSuccees) => {
        const { data, pagination } = responseSuccees;

        this.emitState({
          ...this.state,
          status: EMeNotificationStatusState.FetchSuccess,
          data,
          pagination,
        });
      },
    );
  }
  /**
   * State Name: MeNotificationFindOnes
   * State Status: FetchWaiting | FetchFailure | FetchSuccess
   */
  async pFOnes(uuid: string, query?: IReqQuery) {
    const reqData: IReqUidQuery = {
      uid: uuid,
      query,
    };

    const name = `${ME_NOTIFICATION_STATE}${EMeNotificationNameState.FOnes}`;
    const methodName = this.pFOnes.name;

    this.emitState({
      status: EMeNotificationStatusState.FetchWaiting,
      name,
      methodName,
      reqData,
    });

    const response = await this.meNotificationFOnesUseCase.call(reqData);

    response.fold(
      (responseFailure) => {
        this.emitState({
          ...this.state,
          status: EMeNotificationStatusState.FetchFailure,
          failureCode: responseFailure.code,
          failureMessage: responseFailure.message,
        });
      },
      (responseSuccees) => {
        const { ...data } = responseSuccees;

        this.emitState({
          ...this.state,
          status: EMeNotificationStatusState.FetchSuccess,
          data,
        });
      },
    );
  }
  /**
   * State Name: MeNotificationRead
   * State Status: UpdateWaiting | UpdateFailure | UpdateSuccess
   */
  async pReadNotif(headerId: number) {
    const name = `${ME_NOTIFICATION_STATE}${EMeNotificationNameState.UOnes}`;
    const methodName = this.pReadNotif.name;

    this.emitState({
      status: EMeNotificationStatusState.UpdateWaiting,
      name,
      methodName,
    });

    const response = await this.meNotificationReadUseCase.call(headerId);

    response.fold(
      (responseFailure) => {
        this.emitState({
          ...this.state,
          status: EMeNotificationStatusState.UpdateFailure,
          failureCode: responseFailure.code,
          failureMessage: responseFailure.message,
        });
      },
      (responseSuccees) => {
        const { ...data } = responseSuccees;

        this.emitState({
          ...this.state,
          status: EMeNotificationStatusState.UpdateSuccess,
          data,
        });
      },
    );
  }
  //#endregion MeNotificationthods
}
