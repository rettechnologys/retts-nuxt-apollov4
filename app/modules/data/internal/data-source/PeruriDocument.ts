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
  CPeruriDocumentDto,
  CPeruriDocumentReqOtpBulkDto,
  CPeruriDocumentReqOtpDto,
  CPeruriDocumentSigningBulkDto,
  CPeruriDocumentSigningDto,
  RDataDto,
  RDataPaginatedDto,
  RErrorArrayDto,
  RErrorDto,
  RNonDataDto,
  RPeruriDocumentCheckStatusDto,
  RPeruriDocumentDto,
  RPeruriDocumentRequestOtpBulkDto,
  RPeruriDocumentRequestOtpDto,
  UPeruriSetPasswordDto,
  UPeruriSetSignatureDto,
} from './data-contracts';
import { ContentType, HttpClient, RequestParams } from './http-client';

export class PeruriDocument<
  SecurityDataType = unknown,
> extends HttpClient<SecurityDataType> {
  /**
   * @description Send Document User on Peruri desc
   *
   * @tags peruri-document
   * @name PeruriDocumentControllerSendDocument
   * @summary Send Document User on Peruri
   * @request POST:/api/peruri-document/send-document
   * @secure
   */
  peruriDocumentControllerSendDocument = (
    data: CPeruriDocumentDto,
    params: RequestParams = {},
  ) =>
    this.request<
      RDataDto & {
        /** @example "Success: Ok" */
        message?: string;
        data?: RPeruriDocumentDto;
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
      path: `/api/peruri-document/send-document`,
      method: 'POST',
      body: data,
      secure: true,
      type: ContentType.FormData,
      format: 'json',
      ...params,
    });
  /**
   * @description Set Signature Document on Peruri desc
   *
   * @tags peruri-document
   * @name PeruriDocumentControllerSetSignature
   * @summary Set Signature Document on Peruri
   * @request PUT:/api/peruri-document/set-signature/{uuid}
   * @secure
   */
  peruriDocumentControllerSetSignature = (
    uuid: string,
    data: UPeruriSetSignatureDto,
    params: RequestParams = {},
  ) =>
    this.request<
      RDataDto & {
        /** @example "Success: Ok" */
        message?: string;
        data?: RPeruriDocumentDto;
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
      path: `/api/peruri-document/set-signature/${uuid}`,
      method: 'PUT',
      body: data,
      secure: true,
      type: ContentType.Json,
      format: 'json',
      ...params,
    });
  /**
   * @description Mark signature setup as completed and send notification to all signers who are ready. Call this when user clicks "Selesai" button after setting up signature coordinates. This will notify all signers (INDIVIDUAL, TIER, PARALLEL) who already have signerOrderId.
   *
   * @tags peruri-document
   * @name PeruriDocumentControllerFinishSetSignature
   * @summary Finish Set Signature (Send Notification)
   * @request POST:/api/peruri-document/finish-set-signature/{uuid}
   * @secure
   */
  peruriDocumentControllerFinishSetSignature = (
    uuid: string,
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
      path: `/api/peruri-document/finish-set-signature/${uuid}`,
      method: 'POST',
      secure: true,
      format: 'json',
      ...params,
    });
  /**
   * @description Set Password Document on Peruri desc
   *
   * @tags peruri-document
   * @name PeruriDocumentControllerSetPassword
   * @summary Set Password Document on Peruri
   * @request PUT:/api/peruri-document/set-password/{uuid}
   * @secure
   */
  peruriDocumentControllerSetPassword = (
    uuid: string,
    data: UPeruriSetPasswordDto,
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
      path: `/api/peruri-document/set-password/${uuid}`,
      method: 'PUT',
      body: data,
      secure: true,
      type: ContentType.Json,
      format: 'json',
      ...params,
    });
  /**
   * @description Request OTP Document on Peruri desc
   *
   * @tags peruri-document
   * @name PeruriDocumentControllerRequestOtp
   * @summary Request OTP Document on Peruri
   * @request POST:/api/peruri-document/request-otp/{uuid}
   * @secure
   */
  peruriDocumentControllerRequestOtp = (
    uuid: string,
    data: CPeruriDocumentReqOtpDto,
    params: RequestParams = {},
  ) =>
    this.request<
      RDataDto & {
        /** @example "Success: Ok" */
        message?: string;
        data?: RPeruriDocumentRequestOtpDto;
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
      path: `/api/peruri-document/request-otp/${uuid}`,
      method: 'POST',
      body: data,
      secure: true,
      type: ContentType.Json,
      format: 'json',
      ...params,
    });
  /**
   * @description Request OTP Bulk Document on Peruri desc
   *
   * @tags peruri-document
   * @name PeruriDocumentControllerRequestOtpBulk
   * @summary Request OTP Bulk Document on Peruri
   * @request POST:/api/peruri-document/request-otp-bulk
   * @secure
   */
  peruriDocumentControllerRequestOtpBulk = (
    data: CPeruriDocumentReqOtpBulkDto,
    params: RequestParams = {},
  ) =>
    this.request<
      RDataDto & {
        /** @example "Success: Ok" */
        message?: string;
        data?: RPeruriDocumentRequestOtpBulkDto;
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
      path: `/api/peruri-document/request-otp-bulk`,
      method: 'POST',
      body: data,
      secure: true,
      type: ContentType.Json,
      format: 'json',
      ...params,
    });
  /**
   * @description Signing Document Document on Peruri desc
   *
   * @tags peruri-document
   * @name PeruriDocumentControllerSigning
   * @summary Signing Document Document on Peruri
   * @request POST:/api/peruri-document/signing
   * @secure
   */
  peruriDocumentControllerSigning = (
    data: CPeruriDocumentSigningDto,
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
      path: `/api/peruri-document/signing`,
      method: 'POST',
      body: data,
      secure: true,
      type: ContentType.Json,
      format: 'json',
      ...params,
    });
  /**
   * @description Signing Document Document on Peruri desc
   *
   * @tags peruri-document
   * @name PeruriDocumentControllerSigningBulk
   * @summary Signing Document Document on Peruri
   * @request POST:/api/peruri-document/signing-bulk
   * @secure
   */
  peruriDocumentControllerSigningBulk = (
    data: CPeruriDocumentSigningBulkDto,
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
      path: `/api/peruri-document/signing-bulk`,
      method: 'POST',
      body: data,
      secure: true,
      type: ContentType.Json,
      format: 'json',
      ...params,
    });
  /**
   * @description Check Status Document on Peruri desc
   *
   * @tags peruri-document
   * @name PeruriDocumentControllerCheckDocumentStatus
   * @summary Check Status Document on Peruri
   * @request GET:/api/peruri-document/check-document-status/{uuid}
   * @secure
   */
  peruriDocumentControllerCheckDocumentStatus = (
    uuid: string,
    params: RequestParams = {},
  ) =>
    this.request<
      RDataDto & {
        /** @example "Success: Ok" */
        message?: string;
        data?: RPeruriDocumentCheckStatusDto;
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
      path: `/api/peruri-document/check-document-status/${uuid}`,
      method: 'GET',
      secure: true,
      format: 'json',
      ...params,
    });
  /**
   * @description Delete Order Document on Peruri desc
   *
   * @tags peruri-document
   * @name PeruriDocumentControllerDeleteOrder
   * @summary Delete Order Document on Peruri
   * @request DELETE:/api/peruri-document/deleteOrder/{uuid}
   * @secure
   */
  peruriDocumentControllerDeleteOrder = (
    uuid: string,
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
      path: `/api/peruri-document/deleteOrder/${uuid}`,
      method: 'DELETE',
      secure: true,
      format: 'json',
      ...params,
    });
  /**
   * @description * Description: Get a single data * Controller Name: findOnes * Available fields: id,uuid,fileName,filePath,filePathDownload,orderId,orderIdTier,orderIdParallel,password,currentOrderId,orderType,isDefinedCoordinate,isFinishedSetSignature,uploader,statusDocument,totalSigner,signerDocument,sysDate
   *
   * @tags peruri-document
   * @name GetOneBasePeruriDocumentControllerPeruriDocument
   * @summary Get a single data
   * @request GET:/api/peruri-document/{uuid}
   * @secure
   */
  getOneBasePeruriDocumentControllerPeruriDocument = (
    uuid: string,
    query?: {
      /** Selects resource fields. <a href="https://github.com/nestjsx/crud/wiki/Requests#select" target="_blank">Docs</a> */
      fields?: string[];
      /** Adds relational resources. <a href="https://github.com/nestjsx/crud/wiki/Requests#join" target="_blank">Docs</a> */
      join?: string[];
      /**
       * Include deleted. <a href="https://github.com/nestjsx/crud/wiki/Requests#includeDeleted" target="_blank">Docs</a>
       * @min 0
       * @max 1
       */
      include_deleted?: number;
    },
    params: RequestParams = {},
  ) =>
    this.request<
      RDataDto & {
        /** @example "Success: Ok" */
        message?: string;
        data?: RPeruriDocumentDto;
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
      path: `/api/peruri-document/${uuid}`,
      method: 'GET',
      query: query,
      secure: true,
      format: 'json',
      ...params,
    });
  /**
   * @description * Description: Get multiple data * Controller Name: findManys * Available fields: id,uuid,fileName,filePath,filePathDownload,orderId,orderIdTier,orderIdParallel,password,currentOrderId,orderType,isDefinedCoordinate,isFinishedSetSignature,uploader,statusDocument,totalSigner,signerDocument,sysDate
   *
   * @tags peruri-document
   * @name GetManyBasePeruriDocumentControllerPeruriDocument
   * @summary Get multiple data
   * @request GET:/api/peruri-document
   * @secure
   */
  getManyBasePeruriDocumentControllerPeruriDocument = (
    query?: {
      /** Selects resource fields. <a href="https://github.com/nestjsx/crud/wiki/Requests#select" target="_blank">Docs</a> */
      fields?: string[];
      /** Adds search condition. <a href="https://github.com/nestjsx/crud/wiki/Requests#search" target="_blank">Docs</a> */
      s?: string;
      /** Adds filter condition. <a href="https://github.com/nestjsx/crud/wiki/Requests#filter" target="_blank">Docs</a> */
      filter?: string[];
      /** Adds OR condition. <a href="https://github.com/nestjsx/crud/wiki/Requests#or" target="_blank">Docs</a> */
      or?: string[];
      /** Adds sort by field. <a href="https://github.com/nestjsx/crud/wiki/Requests#sort" target="_blank">Docs</a> */
      sort?: string[];
      /** Adds relational resources. <a href="https://github.com/nestjsx/crud/wiki/Requests#join" target="_blank">Docs</a> */
      join?: string[];
      /** Limit amount of resources. <a href="https://github.com/nestjsx/crud/wiki/Requests#limit" target="_blank">Docs</a> */
      limit?: number;
      /** Page portion of resources. <a href="https://github.com/nestjsx/crud/wiki/Requests#page" target="_blank">Docs</a> */
      page?: number;
      /**
       * Include deleted. <a href="https://github.com/nestjsx/crud/wiki/Requests#includeDeleted" target="_blank">Docs</a>
       * @min 0
       * @max 1
       */
      include_deleted?: number;
    },
    params: RequestParams = {},
  ) =>
    this.request<
      RDataPaginatedDto & {
        /** @example "Success: Ok" */
        message?: string;
        data?: RPeruriDocumentDto[];
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
      path: `/api/peruri-document`,
      method: 'GET',
      query: query,
      secure: true,
      format: 'json',
      ...params,
    });
}
