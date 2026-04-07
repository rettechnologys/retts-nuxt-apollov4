export interface UnexpectedError {
  //status: any;
  status: string;
  error: Error;
}

export type DataError = UnexpectedError;
