import { FetchError } from 'ofetch';
import { Either } from '~/utils/helpers/Either';
import type {
  AuthEntity,
  AuthRefreshTokenEntity,
  AuthRepository,
  ForgotAuthReqBody,
  LoginAuthReqBody,
  LoginAzureAuthReqParam,
} from '@/modules/domain/internal/auth';
import { FAILURE } from '@/utils/types/Constan';
import { EFailureType, IFailure } from '@/utils/types/Failure';
import type { INonDataResponse, IRemoteResponse } from '@/utils/types/ResponseInternal';
import { capitalCaseStr } from '@/utils/helpers/String';
import { inject, singleton } from 'tsyringe';
import { Auth } from '../data-source/Auth';
import { useAppADStore } from '@/stores/AppADStore.client';

@singleton()
export class AuthRepositoryImpl implements AuthRepository {
  private httpClient: Auth;

  constructor(@inject('Auth') httpClient: Auth) {
    this.httpClient = httpClient;
  }

  login(reqBody: LoginAuthReqBody): Promise<Either<IFailure, AuthEntity>> {
    return new Promise((resolve, _reject) => {
      try {
        console.log(
          `[${AuthRepositoryImpl.name}.${this.login.name}]`,
          `reqBody: ${reqBody}`,
        );

        this.httpClient
          .authControllerLogin(reqBody, {
            headers: {
              'Require-Token': false,
            },
            withCredentials: true,
          })
          .then((res) => {
            const remoteResponse: IRemoteResponse = res.data;
            const resData: AuthEntity = remoteResponse.data;

            console.log(
              `[${AuthRepositoryImpl.name}.${this.login.name}] success:`,
              remoteResponse,
            );

            console.log(
              `[${AuthRepositoryImpl.name}.${this.login.name}] success.resData:`,
              resData,
            );

            resolve(Either.right(resData));
          })
          .catch((error) => {
            if (error instanceof FetchError) {
              const ofetchResponse = error.response;
              const remoteResponse = ofetchResponse?._data as IRemoteResponse;

              console.error(
                `[${AuthRepositoryImpl.name}.${this.login.name}] catch.error.remote:`,
                `${error.message} - ${JSON.stringify(remoteResponse)}`,
              );

              return resolve(
                Either.left({
                  type: EFailureType.ResponseInvalid,
                  message: remoteResponse
                    ? remoteResponse.message
                    : error.message,
                  code: remoteResponse ? remoteResponse.meta.statusCode : 0,
                }),
              );
            } else {
              console.error(
                `[${AuthRepositoryImpl.name}.${this.login.name}] catch.error.internal:`,
                `${error}`,
              );

              return resolve(
                Either.left({
                  type: EFailureType.Unexpected,
                  message: capitalCaseStr(EFailureType.Unexpected + FAILURE),
                }),
              );
            }
          });
      } catch (error: any) {
        console.error(
          `[${AuthRepositoryImpl.name}.${this.login.name}] catch.error.unknown:`,
          `${<Error>error}`,
        );

        resolve(
          Either.left({
            type: EFailureType.Unknown,
            message: capitalCaseStr(EFailureType.Unknown + FAILURE),
          }),
        );
      }
    });
  }

  loginAzure(
    param: LoginAzureAuthReqParam,
  ): Promise<Either<IFailure, AuthEntity>> {
    return new Promise((resolve, _reject) => {
      try {
        console.log(
          `[${AuthRepositoryImpl.name}.${this.loginAzure.name}]`,
          `idToken: ${param.idToken}`,
          `accessToken: ${param.accessToken}`,
        );

        this.httpClient
          .authControllerLoginAzure(
            { accessToken: param.accessToken },
            {
              headers: {
                'Require-Token': false,
                Authorization: `Bearer ${param.idToken}`,
              },
              withCredentials: true,
            },
          )
          .then((res) => {
            const remoteResponse: IRemoteResponse = res.data;
            const resData: AuthEntity = remoteResponse.data;

            console.log(
              `[${AuthRepositoryImpl.name}.${this.loginAzure.name}] success:`,
              remoteResponse,
            );

            console.log(
              `[${AuthRepositoryImpl.name}.${this.loginAzure.name}] success.resData:`,
              resData,
            );

            resolve(Either.right(resData));
          })
          .catch((error) => {
            if (error instanceof FetchError) {
              const ofetchResponse = error.response;
              const remoteResponse = ofetchResponse?._data as IRemoteResponse;

              console.error(
                `[${AuthRepositoryImpl.name}.${this.loginAzure.name}] catch.error.remote:`,
                `${error.message} - ${JSON.stringify(remoteResponse)}`,
              );

              return resolve(
                Either.left({
                  type: EFailureType.ResponseInvalid,
                  message: remoteResponse
                    ? remoteResponse.message
                    : error.message,
                  code: remoteResponse ? remoteResponse.meta.statusCode : 0,
                }),
              );
            } else {
              console.error(
                `[${AuthRepositoryImpl.name}.${this.loginAzure.name}] catch.error.internal:`,
                `${error}`,
              );

              return resolve(
                Either.left({
                  type: EFailureType.Unexpected,
                  message: capitalCaseStr(EFailureType.Unexpected + FAILURE),
                }),
              );
            }
          });
      } catch (error: any) {
        console.error(
          `[${AuthRepositoryImpl.name}.${this.loginAzure.name}] catch.error.unknown:`,
          `${<Error>error}`,
        );

        resolve(
          Either.left({
            type: EFailureType.Unknown,
            message: capitalCaseStr(EFailureType.Unknown + FAILURE),
          }),
        );
      }
    });
  }

  logout(): Promise<Either<IFailure, INonDataResponse>> {
    return new Promise((resolve, _reject) => {
      try {
        this.httpClient
          .authControllerLogout({
            withCredentials: true,
          })
          .then((res) => {
            const remoteResponse: IRemoteResponse = res.data;
            const resData: INonDataResponse = {
              success: remoteResponse.success,
              message: remoteResponse.message as string,
            };

            console.log(
              `[${AuthRepositoryImpl.name}.${this.logout.name}] success:`,
              remoteResponse,
            );

            console.log(
              `[${AuthRepositoryImpl.name}.${this.logout.name}] success.resData:`,
              resData,
            );

            resolve(Either.right(resData));
          })
          .catch((error) => {
            if (error instanceof FetchError) {
              const ofetchResponse = error.response;
              const remoteResponse = ofetchResponse?._data as IRemoteResponse;

              console.error(
                `[${AuthRepositoryImpl.name}.${this.logout.name}] catch.error.remote:`,
                `${error.message} - ${JSON.stringify(remoteResponse)}`,
              );

              return resolve(
                Either.left({
                  type: EFailureType.ResponseInvalid,
                  message: remoteResponse
                    ? remoteResponse.message
                    : error.message,
                  code: remoteResponse ? remoteResponse.meta.statusCode : 0,
                }),
              );
            } else {
              console.error(
                `[${AuthRepositoryImpl.name}.${this.logout.name}] catch.error.internal:`,
                `${error}`,
              );

              return resolve(
                Either.left({
                  type: EFailureType.Unexpected,
                  message: capitalCaseStr(EFailureType.Unexpected + FAILURE),
                }),
              );
            }
          });
      } catch (error: any) {
        console.error(
          `[${AuthRepositoryImpl.name}.${this.logout.name}] catch.error.unknown:`,
          `${<Error>error}`,
        );

        resolve(
          Either.left({
            type: EFailureType.Unknown,
            message: capitalCaseStr(EFailureType.Unknown + FAILURE),
          }),
        );
      }
    });
  }

  refreshToken(): Promise<Either<IFailure, AuthRefreshTokenEntity>> {
    return new Promise((resolve, _reject) => {
      const appADState = useAppADStore().getState as AuthEntity;
      try {
        this.httpClient
          .authControllerRefreshToken({
            headers: {
              'Require-Token': false,
              //Authorization: `Bearer ${appADState.authToken.refreshToken}`,
              // [API_KEY_NAME]: API_KEY_VALUE,
              // 'Accept-Language': useLang().currentLang.value,
            },
            withCredentials: true,
          })
          .then((res) => {
            const remoteResponse: IRemoteResponse = res.data;
            const resData = remoteResponse.data as AuthRefreshTokenEntity;

            console.log(
              `[${AuthRepositoryImpl.name}.${this.refreshToken.name}] success:`,
              remoteResponse,
            );

            console.log(
              `[${AuthRepositoryImpl.name}.${this.refreshToken.name}] success.resData:`,
              resData,
            );

            resolve(Either.right(resData));
          })
          .catch((error) => {
            if (error instanceof FetchError) {
              const ofetchResponse = error.response;
              const remoteResponse = ofetchResponse?._data as IRemoteResponse;

              console.error(
                `[${AuthRepositoryImpl.name}.${this.refreshToken.name}] catch.error.remote:`,
                `${error.message} - ${JSON.stringify(remoteResponse)}`,
              );

              return resolve(
                Either.left({
                  type: EFailureType.ResponseInvalid,
                  message: remoteResponse
                    ? remoteResponse.message
                    : error.message,
                  code: remoteResponse ? remoteResponse.meta.statusCode : 0,
                }),
              );
            } else {
              console.error(
                `[${AuthRepositoryImpl.name}.${this.refreshToken.name}] catch.error.internal:`,
                `${error}`,
              );

              return resolve(
                Either.left({
                  type: EFailureType.Unexpected,
                  message: capitalCaseStr(EFailureType.Unexpected + FAILURE),
                }),
              );
            }
          });
      } catch (error: any) {
        console.error(
          `[${AuthRepositoryImpl.name}.${this.refreshToken.name}] catch.error.unknown:`,
          `${<Error>error}`,
        );

        resolve(
          Either.left({
            type: EFailureType.Unknown,
            message: capitalCaseStr(EFailureType.Unknown + FAILURE),
          }),
        );
      }
    });
  }

  // me(): Promise<Either<IFailure, AuthMeEntity>> {
  //   return new Promise((resolve, _reject) => {
  //     try {
  //       this.httpClient
  //         .authControllerMe()
  //         .then((res) => {
  //           const remoteResponse: IRemoteResponse = res.data;
  //           const resData = remoteResponse.data as AuthMeEntity;

  //           console.log(
  //             `[${AuthRepositoryImpl.name}.${this.me.name}] success:`,
  //             remoteResponse,
  //           );

  //           console.log(
  //             `[${AuthRepositoryImpl.name}.${this.me.name}] success.resData:`,
  //             resData,
  //           );

  //           resolve(Either.right(resData));
  //         })
  //         .catch((error) => {
  //           if (error instanceof FetchError) {
  //             const ofetchResponse = error.response;
  //             const remoteResponse = ofetchResponse?._data as IRemoteResponse;

  //             console.error(
  //               `[${AuthRepositoryImpl.name}.${this.me.name}] catch.error.remote:`,
  //               `${error.message} - ${JSON.stringify(remoteResponse)}`,
  //             );

  //             return resolve(
  //               Either.left({
  //                 type: EFailureType.ResponseInvalid,
  //                 message: remoteResponse
  //                   ? remoteResponse.message
  //                   : error.message,
  //                 code: remoteResponse ? remoteResponse.meta.statusCode : 0,
  //               }),
  //             );
  //           } else {
  //             console.error(
  //               `[${AuthRepositoryImpl.name}.${this.me.name}] catch.error.internal:`,
  //               `${error}`,
  //             );

  //             return resolve(
  //               Either.left({
  //                 type: EFailureType.Unexpected,
  //                 message: capitalCaseStr(EFailureType.Unexpected + FAILURE),
  //               }),
  //             );
  //           }
  //         });
  //     } catch (error: any) {
  //       console.error(
  //         `[${AuthRepositoryImpl.name}.${this.me.name}] catch.error.unknown:`,
  //         `${<Error>error}`,
  //       );

  //       resolve(
  //         Either.left({
  //           type: EFailureType.Unknown,
  //           message: capitalCaseStr(EFailureType.Unknown + FAILURE),
  //         }),
  //       );
  //     }
  //   });
  // }

  forgotPassword(
    reqBody: ForgotAuthReqBody,
  ): Promise<Either<IFailure, INonDataResponse>> {
    throw new Error('Method not implemented.');
  }
}
