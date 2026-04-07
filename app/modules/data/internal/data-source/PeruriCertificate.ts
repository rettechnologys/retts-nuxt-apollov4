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
  CPeruriUserDto,
  RDataDto,
  RDataPaginatedDto,
  RErrorArrayDto,
  RErrorDto,
  RNonDataDto,
  RSysUserDto,
  UploadDtoPngJpgJpeg5MB,
  UploadDtoVideos5MB,
} from './data-contracts';
import { ContentType, HttpClient, RequestParams } from './http-client';

export class PeruriCertificate<
  SecurityDataType = unknown,
> extends HttpClient<SecurityDataType> {
  /**
   * @description * Description: Create a single data * Controller Name: registration
   *
   * @tags peruri-certificate
   * @name PeruriCertificateControllerCompleteRegistration
   * @summary Create a single data
   * @request POST:/api/peruri-certificate/complete-registration
   * @secure
   */
  peruriCertificateControllerCompleteRegistration = (
    data: CPeruriUserDto,
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
      path: `/api/peruri-certificate/complete-registration`,
      method: 'POST',
      body: data,
      secure: true,
      type: ContentType.FormData,
      format: 'json',
      ...params,
    });
  /**
   * @description Video Verification on Peruri desc
   *
   * @tags peruri-certificate
   * @name PeruriCertificateControllerVideoVerification
   * @summary Video Verification on Peruri
   * @request POST:/api/peruri-certificate/video-verification
   * @secure
   */
  peruriCertificateControllerVideoVerification = (
    data: UploadDtoVideos5MB,
    params: RequestParams = {},
  ) =>
    this.request<
      RNonDataDto & {
        /** @example "Success: Ok" */
        message?: string;
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
      path: `/api/peruri-certificate/video-verification`,
      method: 'POST',
      body: data,
      secure: true,
      type: ContentType.FormData,
      format: 'json',
      ...params,
    });
  /**
   * @description Send Speciment User on Peruri desc
   *
   * @tags peruri-certificate
   * @name PeruriCertificateControllerSendSpeciment
   * @summary Send Speciment User on Peruri
   * @request POST:/api/peruri-certificate/send-speciment
   * @secure
   */
  peruriCertificateControllerSendSpeciment = (
    data: UploadDtoPngJpgJpeg5MB,
    params: RequestParams = {},
  ) =>
    this.request<
      RNonDataDto & {
        /** @example "Success: Ok" */
        message?: string;
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
      path: `/api/peruri-certificate/send-speciment`,
      method: 'POST',
      body: data,
      secure: true,
      type: ContentType.FormData,
      format: 'json',
      ...params,
    });
  /**
   * @description Check Certificate User on Peruri desc
   *
   * @tags peruri-certificate
   * @name PeruriCertificateControllerCheckCertificate
   * @summary Check Certificate User on Peruri
   * @request GET:/api/peruri-certificate/check-certificate
   * @secure
   */
  peruriCertificateControllerCheckCertificate = (params: RequestParams = {}) =>
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
      path: `/api/peruri-certificate/check-certificate`,
      method: 'GET',
      secure: true,
      format: 'json',
      ...params,
    });
  /**
   * @description * Description: Get multiple data users * Controller Name: findManys * Available fields: id,uuid,name,sysGroupId,email,mobileNumber,isActive,sysDate,profile,sysGroup,peruriUser
   *
   * @tags peruri-certificate
   * @name PeruriCertificateControllerFindManys
   * @summary Get multiple data users
   * @request GET:/api/peruri-certificate/users
   * @secure
   */
  peruriCertificateControllerFindManys = (
    query?: {
      /** Selects resource fields */
      fields?: string[];
      /** Adds search condition */
      s?: string;
      /** Adds filter condition */
      filter?: string[];
      /** Adds OR condition */
      or?: string[];
      /** Adds sort by field */
      sort?: string[];
      /** Adds relational resources */
      join?: string[];
      /** Limit amount of resources */
      limit?: number;
      /** Page portion of resources */
      page?: number;
      /** Include deleted */
      include_deleted?: number;
    },
    params: RequestParams = {},
  ) =>
    this.request<
      RDataPaginatedDto & {
        /** @example "Success: Ok" */
        message?: string;
        data?: RSysUserDto[];
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
      path: `/api/peruri-certificate/users`,
      method: 'GET',
      query: query,
      secure: true,
      format: 'json',
      ...params,
    });
  /**
   * @description * Description: Get a single data user * Controller Name: findOnes * Available fields: id,uuid,name,sysGroupId,email,mobileNumber,isActive,sysDate,profile,sysGroup,peruriUser
   *
   * @tags peruri-certificate
   * @name PeruriCertificateControllerFindOnes
   * @summary Get a single data user
   * @request GET:/api/peruri-certificate/users/{uuid}
   * @secure
   */
  peruriCertificateControllerFindOnes = (
    uuid: string,
    query?: {
      /** Selects resource fields */
      fields?: string[];
      /** Adds relational resources */
      join?: string[];
      /** Include deleted */
      include_deleted?: number;
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
      path: `/api/peruri-certificate/users/${uuid}`,
      method: 'GET',
      query: query,
      secure: true,
      format: 'json',
      ...params,
    });
}
