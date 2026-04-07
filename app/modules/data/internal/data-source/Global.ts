/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

import {
  RDataDto,
  RErrorArrayDto,
  RErrorDto,
  RGlobalConfigDto,
  RGlobalHealthDto,
  RSysNotifCategorytSimpleDto,
} from './data-contracts';
import { HttpClient, RequestParams } from './http-client';

export class Global<
  SecurityDataType = unknown,
> extends HttpClient<SecurityDataType> {
  /**
   * @description * Description: Check health status * Controller Name: healthChecks
   *
   * @tags global
   * @name GlobalControllerHealths
   * @summary Check health status
   * @request GET:/api/global/healths
   * @secure
   */
  globalControllerHealths = (params: RequestParams = {}) =>
    this.request<
      RDataDto & {
        /** @example "Success: Ok" */
        message?: string;
        data?: RGlobalHealthDto;
      },
      | (RErrorArrayDto & {
          /** @example "["(name) tidak boleh kosong","(name) tidak boleh kurang dari 2 karakter"]" */
          message?: string;
        })
      | (RErrorDto & {
          /** @example "Unauthorized" */
          message?: string;
        })
      | (RErrorDto & {
          /** @example "Forbidden" */
          message?: string;
        })
      | (RErrorDto & {
          /** @example "Not found" */
          message?: string;
        })
      | (RErrorDto & {
          /** @example "Internal server error" */
          message?: string;
        })
      | (RErrorDto & {
          /** @example "Bad gateway" */
          message?: string;
        })
      | {
          /** @example "error" */
          status?: string;
          /** @example {"database":{"status":"up"}} */
          info?: Record<
            string,
            {
              status: string;
              [key: string]: any;
            }
          >;
          /** @example {"redis":{"status":"down","message":"Could not connect"}} */
          error?: Record<
            string,
            {
              status: string;
              [key: string]: any;
            }
          >;
          /** @example {"database":{"status":"up"},"redis":{"status":"down","message":"Could not connect"}} */
          details?: Record<
            string,
            {
              status: string;
              [key: string]: any;
            }
          >;
        }
      | (RErrorDto & {
          /** @example "Gateway timeout" */
          message?: string;
        })
    >({
      path: `/api/global/healths`,
      method: 'GET',
      secure: true,
      format: 'json',
      ...params,
    });
  /**
   * @description * Description: Get global config data * Controller Name: configs
   *
   * @tags global
   * @name GlobalControllerConfigs
   * @summary Get global config data
   * @request GET:/api/global/configs
   * @secure
   */
  globalControllerConfigs = (params: RequestParams = {}) =>
    this.request<
      RDataDto & {
        /** @example "Success: Ok" */
        message?: string;
        data?: RGlobalConfigDto;
      },
      | (RErrorArrayDto & {
          /** @example "["(name) tidak boleh kosong","(name) tidak boleh kurang dari 2 karakter"]" */
          message?: string;
        })
      | (RErrorDto & {
          /** @example "Unauthorized" */
          message?: string;
        })
      | (RErrorDto & {
          /** @example "Forbidden" */
          message?: string;
        })
      | (RErrorDto & {
          /** @example "Not found" */
          message?: string;
        })
      | (RErrorDto & {
          /** @example "Internal server error" */
          message?: string;
        })
      | (RErrorDto & {
          /** @example "Bad gateway" */
          message?: string;
        })
      | (RErrorDto & {
          /** @example "Service unavailable" */
          message?: string;
        })
      | (RErrorDto & {
          /** @example "Gateway timeout" */
          message?: string;
        })
    >({
      path: `/api/global/configs`,
      method: 'GET',
      secure: true,
      format: 'json',
      ...params,
    });
  /**
   * @description * Description: Get global config data * Controller Name: configs
   *
   * @tags global
   * @name GlobalControllerNotifCategories
   * @summary Get global config data
   * @request GET:/api/global/notif-categories
   * @secure
   */
  globalControllerNotifCategories = (params: RequestParams = {}) =>
    this.request<
      RDataDto & {
        /** @example "Success: Ok" */
        message?: string;
        data?: RSysNotifCategorytSimpleDto;
      },
      | (RErrorArrayDto & {
          /** @example "["(name) tidak boleh kosong","(name) tidak boleh kurang dari 2 karakter"]" */
          message?: string;
        })
      | (RErrorDto & {
          /** @example "Unauthorized" */
          message?: string;
        })
      | (RErrorDto & {
          /** @example "Forbidden" */
          message?: string;
        })
      | (RErrorDto & {
          /** @example "Not found" */
          message?: string;
        })
      | (RErrorDto & {
          /** @example "Internal server error" */
          message?: string;
        })
      | (RErrorDto & {
          /** @example "Bad gateway" */
          message?: string;
        })
      | (RErrorDto & {
          /** @example "Service unavailable" */
          message?: string;
        })
      | (RErrorDto & {
          /** @example "Gateway timeout" */
          message?: string;
        })
    >({
      path: `/api/global/notif-categories`,
      method: 'GET',
      secure: true,
      format: 'json',
      ...params,
    });
  /**
   * @description * Description: Download files * Controller Name: downloadFile
   *
   * @tags global
   * @name GlobalControllerDownloadFile
   * @summary Download file
   * @request GET:/api/global/download-file
   * @secure
   */
  globalControllerDownloadFile = (
    query: {
      path: string;
    },
    params: RequestParams = {},
  ) =>
    this.request<
      File,
      | (RErrorArrayDto & {
          /** @example "["(name) tidak boleh kosong","(name) tidak boleh kurang dari 2 karakter"]" */
          message?: string;
        })
      | (RErrorDto & {
          /** @example "Unauthorized" */
          message?: string;
        })
      | (RErrorDto & {
          /** @example "Forbidden" */
          message?: string;
        })
      | (RErrorDto & {
          /** @example "Not found" */
          message?: string;
        })
      | (RErrorDto & {
          /** @example "Internal server error" */
          message?: string;
        })
      | (RErrorDto & {
          /** @example "Bad gateway" */
          message?: string;
        })
      | (RErrorDto & {
          /** @example "Service unavailable" */
          message?: string;
        })
      | (RErrorDto & {
          /** @example "Gateway timeout" */
          message?: string;
        })
    >({
      path: `/api/global/download-file`,
      method: 'GET',
      query: query,
      secure: true,
      format: 'blob',
      ...params,
    });
}
