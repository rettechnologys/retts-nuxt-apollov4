export interface IReqQuery {
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
}

/**
 * This is the interface for the unique ID (uuid/keyword/id/etc) & request body
 * @param T - the data type
 */
export interface IReqUidBody<T = any> {
  uid: string | number;
  reqBody: T;
}

/**
 * This is the interface for the unique ID (uuid/keyword/id/etc) & query
 */
export interface IReqUidQuery {
  uid: string | number;
  query?: IReqQuery;
}

export type IReqUidBodyQuery = Partial<IReqUidBody<any> | IReqUidQuery>;

export interface IReqSingleFile {
  file: File;
}

export interface IReqMultiFile {
  files: File[];
}
