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
  RDataPaginatedDto,
  RErrorArrayDto,
  RErrorDto,
  RSapPenyerapanPoDto,
} from './data-contracts';
import { HttpClient, RequestParams } from './http-client';

export class SapPenyerapanPos<
  SecurityDataType = unknown,
> extends HttpClient<SecurityDataType> {
  /**
   * @description * Description: Get a single data * Controller Name: findOnes * Available fields: id,poNumber,documentType,lastChangeDate,documentDate,companyCode,vendorNumber,purchasingOrganization,purchasingGroup,releaseIndicator,profitCenter,customerNumber,currencyPo,netOrderValue,currency,amountInDocCurrency,headerCurrency,amountInLocalCurrency,vendorName,paymentTerms,startDate,endDate,incoterms,additionalIncoterms,contractNumber,contractText,contractDateText,manualReferenceText,sysDate
   *
   * @tags sap-penyerapan-pos
   * @name GetOneBaseSapPenyerapanPoControllerSapPenyerapanPo
   * @summary Get a single data
   * @request GET:/api/sap-penyerapan-pos/{id}
   * @secure
   */
  getOneBaseSapPenyerapanPoControllerSapPenyerapanPo = (
    id: number,
    query?: {
      /** Selects resource fields. <a href="https://github.com/nestjsx/crud/wiki/Requests#select" target="_blank">Docs</a> */
      fields?: string[];
      /** Adds relational resources. <a href="https://github.com/nestjsx/crud/wiki/Requests#join" target="_blank">Docs</a> */
      join?: string[];
    },
    params: RequestParams = {},
  ) =>
    this.request<
      RDataDto & {
        /** @example "Success: Ok" */
        message?: string;
        data?: RSapPenyerapanPoDto;
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
      path: `/api/sap-penyerapan-pos/${id}`,
      method: 'GET',
      query: query,
      secure: true,
      format: 'json',
      ...params,
    });
  /**
   * @description * Description: Get multiple data * Controller Name: findManys * Available fields: id,poNumber,documentType,lastChangeDate,documentDate,companyCode,vendorNumber,purchasingOrganization,purchasingGroup,releaseIndicator,profitCenter,customerNumber,currencyPo,netOrderValue,currency,amountInDocCurrency,headerCurrency,amountInLocalCurrency,vendorName,paymentTerms,startDate,endDate,incoterms,additionalIncoterms,contractNumber,contractText,contractDateText,manualReferenceText,sysDate
   *
   * @tags sap-penyerapan-pos
   * @name GetManyBaseSapPenyerapanPoControllerSapPenyerapanPo
   * @summary Get multiple data
   * @request GET:/api/sap-penyerapan-pos
   * @secure
   */
  getManyBaseSapPenyerapanPoControllerSapPenyerapanPo = (
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
    },
    params: RequestParams = {},
  ) =>
    this.request<
      RDataPaginatedDto & {
        /** @example "Success: Ok" */
        message?: string;
        data?: RSapPenyerapanPoDto[];
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
      path: `/api/sap-penyerapan-pos`,
      method: 'GET',
      query: query,
      secure: true,
      format: 'json',
      ...params,
    });
}
