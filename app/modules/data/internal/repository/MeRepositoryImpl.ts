import { Either } from '~/utils/helpers/Either';
import { capitalCaseStr } from '~/utils/helpers/String';
import { MeEntity, MeRepository } from '~/modules//domain/internal/me';
import { FAILURE } from '@/utils/types/Constan';
import { EFailureType, IFailure } from '@/utils/types/Failure';
import { IRemoteResponse } from '@/utils/types/ResponseInternal';
import { FetchError } from 'ofetch';
import { inject, singleton } from 'tsyringe';
import { Me } from '../data-source/Me';

@singleton()
export class MeRepositoryImpl implements MeRepository {
  private httpClient: Me;

  constructor(@inject('Me') httpClient: Me) {
    this.httpClient = httpClient;
  }

  me(): Promise<Either<IFailure, MeEntity>> {
    return new Promise((resolve, _reject) => {
      try {
        this.httpClient
          .meControllerMe()
          .then((res) => {
            const remoteResponse: IRemoteResponse = res.data;
            const resData = remoteResponse.data as MeEntity;

            console.log(
              `[${MeRepositoryImpl.name}.${this.me.name}] success:`,
              remoteResponse,
            );

            console.log(
              `[${MeRepositoryImpl.name}.${this.me.name}] success.resData:`,
              resData,
            );

            resolve(Either.right(resData));
          })
          .catch((error) => {
            if (error instanceof FetchError) {
              const ofetchResponse = error.response;
              const remoteResponse = ofetchResponse?._data as IRemoteResponse;

              console.error(
                `[${MeRepositoryImpl.name}.${this.me.name}] catch.error.remote:`,
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
                `[${MeRepositoryImpl.name}.${this.me.name}] catch.error.internal:`,
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
          `[${MeRepositoryImpl.name}.${this.me.name}] catch.error.unknown:`,
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
