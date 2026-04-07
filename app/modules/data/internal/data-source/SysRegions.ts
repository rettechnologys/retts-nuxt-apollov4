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
  RNonDataDto,
  RRegionDistrictDto,
  RRegionProvinceDto,
  RRegionRegencyDto,
  RRegionVillageDto,
} from './data-contracts';
import { HttpClient, RequestParams } from './http-client';

export class SysRegions<
  SecurityDataType = unknown,
> extends HttpClient<SecurityDataType> {
  /**
   * @description * Description: Get a single data * Controller Name: findOnes * Available fields: id,uuid,code,name,sysDate
   *
   * @tags sys-regions
   * @name SysRegionControllerFindManysProvince
   * @summary Get a single data
   * @request GET:/api/sys-regions/province
   * @secure
   */
  sysRegionControllerFindManysProvince = (params: RequestParams = {}) =>
    this.request<
      RDataDto & {
        /** @example "Success: Ok" */
        message?: string;
        data?: RRegionProvinceDto[];
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
      path: `/api/sys-regions/province`,
      method: 'GET',
      secure: true,
      format: 'json',
      ...params,
    });
  /**
   * @description * Description: Get all regencies by provinceId * Controller Name: findManysRegency * Available fields: id,uuid,code,name,provinceId,sysDate
   *
   * @tags sys-regions
   * @name SysRegionControllerFindManysRegency
   * @summary Get regencies by province
   * @request GET:/api/sys-regions/regency/{provinceId}
   * @secure
   */
  sysRegionControllerFindManysRegency = (
    provinceId: number,
    params: RequestParams = {},
  ) =>
    this.request<
      RDataDto & {
        /** @example "Success: Ok" */
        message?: string;
        data?: RRegionRegencyDto[];
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
      path: `/api/sys-regions/regency/${provinceId}`,
      method: 'GET',
      secure: true,
      format: 'json',
      ...params,
    });
  /**
   * @description * Description: Get all districts by regencyId * Controller Name: findManysDistrict * Available fields: id,uuid,code,name,regencyId,sysDate
   *
   * @tags sys-regions
   * @name SysRegionControllerFindManysDistrict
   * @summary Get districts by regency
   * @request GET:/api/sys-regions/district/{regencyId}
   * @secure
   */
  sysRegionControllerFindManysDistrict = (
    regencyId: number,
    params: RequestParams = {},
  ) =>
    this.request<
      RDataDto & {
        /** @example "Success: Ok" */
        message?: string;
        data?: RRegionDistrictDto[];
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
      path: `/api/sys-regions/district/${regencyId}`,
      method: 'GET',
      secure: true,
      format: 'json',
      ...params,
    });
  /**
   * @description * Description: Get all villages by districtId * Controller Name: findManysVillage * Available fields: id,uuid,code,name,district,districtId,sysDate
   *
   * @tags sys-regions
   * @name SysRegionControllerFindManysVillage
   * @summary Get villages by district
   * @request GET:/api/sys-regions/village/{districtId}
   * @secure
   */
  sysRegionControllerFindManysVillage = (
    districtId: number,
    params: RequestParams = {},
  ) =>
    this.request<
      RDataDto & {
        /** @example "Success: Ok" */
        message?: string;
        data?: RRegionVillageDto[];
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
      path: `/api/sys-regions/village/${districtId}`,
      method: 'GET',
      secure: true,
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags sys-regions
   * @name SysRegionControllerSyncRegion
   * @summary Sync Region
   * @request GET:/api/sys-regions/sync-region
   * @secure
   */
  sysRegionControllerSyncRegion = (
    query: {
      level: 'PROVINCE' | 'REGENCY' | 'DISTRICT' | 'VILLAGE';
      code?: string;
    },
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
      path: `/api/sys-regions/sync-region`,
      method: 'GET',
      query: query,
      secure: true,
      format: 'json',
      ...params,
    });
}
