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
  RSysUserDto,
  USysUserDto,
} from './data-contracts';
import { ContentType, HttpClient, RequestParams } from './http-client';

export class MeProfiles<
  SecurityDataType = unknown,
> extends HttpClient<SecurityDataType> {
  /**
   * @description * Description: Update current user data * Controller Name: updateOnes
   *
   * @tags me-profiles
   * @name ProfileControllerUpdateOnes
   * @summary Update current user data
   * @request PATCH:/api/me/profiles
   * @secure
   */
  profileControllerUpdateOnes = (
    data: USysUserDto,
    params: RequestParams = {},
  ) =>
    this.request<
      RDataDto & {
        /** @example "Success: Ok" */
        message?: string;
        data?: RSysUserDto;
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
      path: `/api/me/profiles`,
      method: 'PATCH',
      body: data,
      secure: true,
      type: ContentType.FormData,
      format: 'json',
      ...params,
    });
  /**
   * @description * Description: Update an avatar for a user * Controller Name: updateAvatar
   *
   * @tags me-profiles
   * @name ProfileControllerUpdateAvatar
   * @summary Update avatar for a user
   * @request PATCH:/api/me/profiles/update-avatar
   * @secure
   */
  profileControllerUpdateAvatar = (
    data: {
      /** @format binary */
      file?: File;
    },
    params: RequestParams = {},
  ) =>
    this.request<
      RDataDto & {
        /** @example "Success: Ok" */
        message?: string;
        data?: RSysUserDto;
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
      path: `/api/me/profiles/update-avatar`,
      method: 'PATCH',
      body: data,
      secure: true,
      type: ContentType.FormData,
      format: 'json',
      ...params,
    });
}
