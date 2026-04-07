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
  RSysMenuAclActionsDto,
  RSysMenuAclDto,
  RSysMenuAclSimpleDto,
  USysMenuAclDto,
} from './data-contracts';
import { ContentType, HttpClient, RequestParams } from './http-client';

export class SysMenusAcls<
  SecurityDataType = unknown,
> extends HttpClient<SecurityDataType> {
  /**
   * @description Get multiple data acl by sysGroupId desc
   *
   * @tags sys-menus-acls
   * @name SysMenuAclControllerFindManysByGroupId
   * @summary Get multiple data acl by sysGroupId
   * @request GET:/api/sys-menus-acls/{sysGroupId}
   * @secure
   */
  sysMenuAclControllerFindManysByGroupId = (
    sysGroupId: number,
    params: RequestParams = {},
  ) =>
    this.request<
      RDataDto & {
        /** @example "Success: Ok" */
        message?: string;
        data?: RSysMenuAclDto[];
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
      path: `/api/sys-menus-acls/${sysGroupId}`,
      method: 'GET',
      secure: true,
      format: 'json',
      ...params,
    });
  /**
   * @description Get multiple data acl actions by groupid & sysMenuId desc
   *
   * @tags sys-menus-acls
   * @name SysMenuAclControllerFindManysActions
   * @summary Get multiple data acl actions by sysGroupId & sysMenuId
   * @request GET:/api/sys-menus-acls/{sysGroupId}/actions/{sysMenuId}
   * @secure
   */
  sysMenuAclControllerFindManysActions = (
    sysGroupId: number,
    sysMenuId: number,
    params: RequestParams = {},
  ) =>
    this.request<
      RDataDto & {
        /** @example "Success: Ok" */
        message?: string;
        data?: RSysMenuAclActionsDto[];
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
      path: `/api/sys-menus-acls/${sysGroupId}/actions/${sysMenuId}`,
      method: 'GET',
      secure: true,
      format: 'json',
      ...params,
    });
  /**
   * @description Update a single data acl by sysGroupId & sysMenuId desc
   *
   * @tags sys-menus-acls
   * @name SysMenuAclControllerUpdateOnes
   * @summary Update a single data acl by sysGroupId & sysMenuId
   * @request PATCH:/api/sys-menus-acls/{sysGroupId}/{sysMenuId}
   * @secure
   */
  sysMenuAclControllerUpdateOnes = (
    sysGroupId: number,
    sysMenuId: number,
    data: USysMenuAclDto,
    params: RequestParams = {},
  ) =>
    this.request<
      RDataDto & {
        /** @example "Success: Ok" */
        message?: string;
        data?: RSysMenuAclSimpleDto;
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
      path: `/api/sys-menus-acls/${sysGroupId}/${sysMenuId}`,
      method: 'PATCH',
      body: data,
      secure: true,
      type: ContentType.Json,
      format: 'json',
      ...params,
    });
}
