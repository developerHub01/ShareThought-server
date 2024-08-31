export interface IErrorSource {
  path: string | number;
  message: string;
}

export interface IGeneralErrorDetails {
  success?: boolean;
  statusCode?: number;
  message?: string;
  errorSources: Array<IErrorSource>;
}

export type TMongooseDuplcateError = Record<string, unknown> & {
  keyValue: Record<string, unknown>;
};
