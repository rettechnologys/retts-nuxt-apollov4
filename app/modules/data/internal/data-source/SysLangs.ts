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
  CUSysLangDto,
  RDataDto,
  RErrorArrayDto,
  RErrorDto,
  RSysLangDto,
} from './data-contracts';
import { ContentType, HttpClient, RequestParams } from './http-client';

export class SysLangs<
  SecurityDataType = unknown,
> extends HttpClient<SecurityDataType> {
  /**
   * @description Create/Update a single data desc
   *
   * @tags sys-langs
   * @name SysLangControllerCreateUpdateOnes
   * @summary Create/Update a single data
   * @request POST:/api/sys-langs
   * @secure
   */
  sysLangControllerCreateUpdateOnes = (
    data: CUSysLangDto,
    params: RequestParams = {},
  ) =>
    this.request<
      RDataDto & {
        /** @example "Success: Ok" */
        message?: string;
        data?: RSysLangDto;
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
      path: `/api/sys-langs`,
      method: 'POST',
      body: data,
      secure: true,
      type: ContentType.Json,
      format: 'json',
      ...params,
    });
  /**
   * @description Get multiple data data desc
   *
   * @tags sys-langs
   * @name SysLangControllerFindManys
   * @summary Get multiple data data
   * @request GET:/api/sys-langs
   * @secure
   */
  sysLangControllerFindManys = (params: RequestParams = {}) =>
    this.request<
      RDataDto & {
        /** @example "Success: Ok" */
        message?: string;
        data?: RSysLangDto[];
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
      path: `/api/sys-langs`,
      method: 'GET',
      secure: true,
      format: 'json',
      ...params,
    });
  /**
   * @description Get a single data desc
   *
   * @tags sys-langs
   * @name SysLangControllerFindOnes
   * @summary Get a single data
   * @request GET:/api/sys-langs/{id}
   * @secure
   */
  sysLangControllerFindOnes = (id: string, params: RequestParams = {}) =>
    this.request<
      RDataDto & {
        /** @example "Success: Ok" */
        message?: string;
        data?: RSysLangDto;
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
      path: `/api/sys-langs/${id}`,
      method: 'GET',
      secure: true,
      format: 'json',
      ...params,
    });
  /**
   * @description Remove a single data desc
   *
   * @tags sys-langs
   * @name SysLangControllerRemoveOnes
   * @summary Remove a single data
   * @request DELETE:/api/sys-langs/{id}
   * @secure
   */
  sysLangControllerRemoveOnes = (id: string, params: RequestParams = {}) =>
    this.request<
      RDataDto & {
        /** @example "Success: Ok" */
        message?: string;
        data?: RSysLangDto;
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
      path: `/api/sys-langs/${id}`,
      method: 'DELETE',
      secure: true,
      format: 'json',
      ...params,
    });
  /**
   * @description Recover a single data desc
   *
   * @tags sys-langs
   * @name SysLangControllerRecoverOnes
   * @summary Recover a single data
   * @request PATCH:/api/sys-langs/{id}/recover
   * @secure
   */
  sysLangControllerRecoverOnes = (id: string, params: RequestParams = {}) =>
    this.request<
      RDataDto & {
        /** @example "Success: Ok" */
        message?: string;
        data?: RSysLangDto;
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
      path: `/api/sys-langs/${id}/recover`,
      method: 'PATCH',
      secure: true,
      format: 'json',
      ...params,
    });
}
