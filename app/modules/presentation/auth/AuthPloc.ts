import { Ploc } from '~/utils/helpers/Ploc';
import {
  ForgotAuthReqBody,
  LoginAuthReqBody,
  LoginAzureAuthReqParam,
} from '~/modules//domain/internal/auth/AuthEntity';
import {
  AuthForgotPasswordUseCase,
  AuthLoginAzureUseCase,
  AuthLoginUseCase,
  AuthLogoutUseCase,
} from '~/modules//domain/internal/auth/usecase';
import { useDynamicStore } from '~/stores/DynamicStore';
import { inject, singleton } from 'tsyringe';
import {
  AUTH_STATE,
  AuthState,
  EAuthNameState,
  EAuthStatusState,
  initialState,
} from './AuthState';
import { useAppADStore } from '~/stores/AppADStore.client';

@singleton()
export class AuthPloc extends Ploc<AuthState> {
  constructor(
    @inject('AuthLoginUseCase')
    protected authLoginUseCase: AuthLoginUseCase,
    @inject('AuthLogoutUseCase')
    protected authLogoutUseCase: AuthLogoutUseCase,
    @inject('AuthForgotPasswordUseCase')
    protected authForgotPasswordUseCase: AuthForgotPasswordUseCase,
    // @inject('AuthMeUseCase')
    // protected authMeUseCase: AuthMeUseCase,
    @inject('AuthLoginAzureUseCase')
    protected authLoginAzureUseCase: AuthLoginAzureUseCase,
  ) {
    const authStore = useDynamicStore(AUTH_STATE, initialState);
    console.log(`${AuthPloc.name}:constructor:dynamicstore`, authStore);
    super(authStore, true);
  }

  //* Store Auth Data
  appADStore = useAppADStore();

  //#region Methods => start with 'p'
  async pLogin(reqBody: LoginAuthReqBody) {
    const name = `${AUTH_STATE}${EAuthNameState.Login}`;
    const methodName = this.pLogin.name;

    this.emitState({
      status: EAuthStatusState.FetchWaiting,
      name,
      methodName,
      reqData: {
        reqBody,
      },
    });

    const response = await this.authLoginUseCase.call(reqBody);

    response.fold(
      (responseFailure) => {
        this.emitState({
          ...this.state,
          status: EAuthStatusState.FetchFailure,
          failureCode: responseFailure.code,
          failureMessage: responseFailure.message,
        });
      },
      async (responseSuccees) => {
        const { ...data } = responseSuccees;

        this.emitState({
          ...this.state,
          status: EAuthStatusState.FetchSuccess,
          data,
        });

        //* Store Auth Data
        await this.appADStore.setState(responseSuccees);
      },
    );
  }

  async pLoginAzure(param: LoginAzureAuthReqParam) {
    const name = `${AUTH_STATE}${EAuthNameState.LoginAzure}`;
    const methodName = this.pLoginAzure.name;

    this.emitState({
      status: EAuthStatusState.FetchWaiting,
      name,
      methodName,
    });

    const response = await this.authLoginAzureUseCase.call(param);

    response.fold(
      (responseFailure) => {
        this.emitState({
          ...this.state,
          status: EAuthStatusState.FetchFailure,
          failureCode: responseFailure.code,
          failureMessage: responseFailure.message,
        });
      },
      async (responseSuccees) => {
        const { ...data } = responseSuccees;

        this.emitState({
          ...this.state,
          status: EAuthStatusState.FetchSuccess,
          data,
        });

        //* Store Auth Data
        await this.appADStore.setState(responseSuccees);
      },
    );
  }

  // async pMe() {
  //   const name = `${AUTH_STATE}${EAuthNameState.Me}`;
  //   const methodName = this.pMe.name;

  //   this.emitState({
  //     status: EAuthStatusState.FetchWaiting,
  //     name,
  //     methodName,
  //   });

  //   const response = await this.authMeUseCase.call();

  //   response.fold(
  //     (responseFailure) => {
  //       this.emitState({
  //         ...this.state,
  //         status: EAuthStatusState.FetchFailure,
  //         failureCode: responseFailure.code,
  //         failureMessage: responseFailure.message,
  //       });
  //     },
  //     async (responseSuccees) => {
  //       const { ...data } = responseSuccees;

  //       this.emitState({
  //         ...this.state,
  //         status: EAuthStatusState.FetchSuccess,
  //         data,
  //       });

  //       //* Store Auth Data
  //       await this.appADStore.setState(responseSuccees);
  //     },
  //   );
  // }

  async pLogout() {
    const name = `${AUTH_STATE}${EAuthNameState.Logout}`;
    const methodName = this.pLogout.name;

    this.emitState({
      status: EAuthStatusState.FetchWaiting,
      name,
      methodName,
    });

    const response = await this.authLogoutUseCase.call();

    response.fold(
      (responseFailure) => {
        if (responseFailure.code === 401) {
          this.emitState({
            ...this.state,
            status: EAuthStatusState.FetchFailure,
            failureCode: responseFailure.code,
            failureMessage: responseFailure.message,
          });

          //* Store Auth Data
          this.appADStore.logout();
        } else {
          this.emitState({
            ...this.state,
            status: EAuthStatusState.FetchFailure,
            failureCode: responseFailure.code,
            failureMessage: responseFailure.message,
          });
        }
      },
      (responseSuccees) => {
        this.emitState({
          ...this.state,
          status: EAuthStatusState.FetchSuccess,
          successMessage: responseSuccees?.message,
        });

        //* Store Auth Data
        this.appADStore.logout();
      },
    );
  }

  async pForgotPassword(forgotReqBody: ForgotAuthReqBody) {
    const name = `${AUTH_STATE}${EAuthNameState.ForgotPassword}`;
    const methodName = this.pForgotPassword.name;

    this.emitState({
      ...this.state,
      status: EAuthStatusState.FetchWaiting,
      name,
      methodName,
    });

    const response = await this.authForgotPasswordUseCase.call(forgotReqBody);

    response.fold(
      (responseFailure) => {
        this.emitState({
          ...this.state,
          status: EAuthStatusState.FetchFailure,
          failureCode: responseFailure.code,
          failureMessage: responseFailure.message,
        });
      },
      (responseSuccees) => {
        this.emitState({
          ...this.state,
          status: EAuthStatusState.FetchSuccess,
          successMessage: responseSuccees?.message,
        });
      },
    );
  }
  //#endregion Methods
}
