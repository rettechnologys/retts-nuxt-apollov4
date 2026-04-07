import { Either } from '@retts-packages/utilities-helper';
import {
  GlobalConfigEntity,
  GlobalHealthEntity,
  GlobalRepository,
} from '@/modules/domain/internal/global';
import { FAILURE } from '@/utils/types/Constan';
import { EFailureType, IFailure } from '@/utils/types/Failure';
import { IRemoteResponse } from '@/utils/types/ResponseInternal';
import axios from 'axios';
import { capitalCaseStr } from '@retts-packages/utilities-helper';
import { inject, singleton } from 'tsyringe';
import { Global } from '../data-source/Global';
import { RequestParams } from '../data-source/http-client';

@singleton()
export class GlobalRepositoryImpl implements GlobalRepository {
  private httpClient: Global;

  constructor(@inject('Global') httpClient: Global) {
    this.httpClient = httpClient;
  }

  configs(): Promise<Either<IFailure, GlobalConfigEntity>> {
    return new Promise((resolve, _reject) => {
      try {
        this.httpClient
          .globalControllerConfigs({
            headers: {
              'Require-Token': false,
            },
          })
          .then((res) => {
            const remoteResponse: IRemoteResponse = res.data;
            const resData: GlobalConfigEntity = remoteResponse.data;

            console.log(
              `[${GlobalRepositoryImpl.name}.${this.configs.name}] success:`,
              res,
            );

            console.log(
              `[${GlobalRepositoryImpl.name}.${this.configs.name}] success.resData:`,
              resData,
            );

            resolve(Either.right(resData));
          })
          .catch((error) => {
            if (axios.isAxiosError(error)) {
              const axiosResponse = error.response;
              const remoteResponse = axiosResponse?.data as IRemoteResponse;

              console.error(
                `[${GlobalRepositoryImpl.name}.${this.configs.name}] catch.error.remote:`,
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
                `[${GlobalRepositoryImpl.name}.${this.configs.name}] catch.error.internal:`,
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
          `[${GlobalRepositoryImpl.name}.${this.configs.name}] catch.error.unknown:`,
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

  healths(): Promise<Either<IFailure, GlobalHealthEntity>> {
    return new Promise((resolve, _reject) => {
      try {
        this.httpClient
          .globalControllerHealths({
            headers: {
              'Require-Token': false,
            },
          })
          .then((res) => {
            const remoteResponse: IRemoteResponse = res.data;
            const resData: GlobalHealthEntity = remoteResponse.data;

            console.log(
              `[${GlobalRepositoryImpl.name}.${this.healths.name}] success:`,
              remoteResponse,
            );

            console.log(
              `[${GlobalRepositoryImpl.name}.${this.healths.name}] success.resData:`,
              resData,
            );

            resolve(Either.right(resData));
          })
          .catch((error) => {
            if (axios.isAxiosError(error)) {
              const axiosResponse = error.response;
              const remoteResponse = axiosResponse?.data as IRemoteResponse;

              console.error(
                `[${GlobalRepositoryImpl.name}.${this.healths.name}] catch.error.remote:`,
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
                `[${GlobalRepositoryImpl.name}.${this.healths.name}] catch.error.internal:`,
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
          `[${GlobalRepositoryImpl.name}.${this.healths.name}] catch.error.unknown:`,
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
  downloadFile(
    path: string,
    axiosConfig?: RequestParams,
  ): Promise<Either<IFailure, Blob>> {
    return new Promise((resolve, _reject) => {
      try {
        this.httpClient
          .globalControllerDownloadFile(
            {
              path: path,
            },
            { ...axiosConfig },
          )
          .then((res) => {
            const resData: Blob = res.data as any;

            console.log(
              `[${GlobalRepositoryImpl.name}.${this.downloadFile.name}] success:`,
              res,
            );

            console.log(
              `[${GlobalRepositoryImpl.name}.${this.downloadFile.name}] success.resData:`,
              resData,
            );

            resolve(Either.right(resData));
          })
          .catch((error) => {
            if (axios.isAxiosError(error)) {
              const axiosResponse = error.response;
              const remoteResponse = axiosResponse?.data as IRemoteResponse;

              console.error(
                `[${GlobalRepositoryImpl.name}.${this.downloadFile.name}] catch.error.remote:`,
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
                `[${GlobalRepositoryImpl.name}.${this.downloadFile.name}] catch.error.internal:`,
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
          `[${GlobalRepositoryImpl.name}.${this.downloadFile.name}] catch.error.unknown:`,
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
}
