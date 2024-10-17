export interface ILoginUser {
  email?: string;
  userName?: string;
  password: string;
}

export interface IJWTPayload {
  userId?: string;
  channelId?: string;
  guestId?: string;
  moderatorId?: string;
}

export interface IEmailVarificationLinkGeneratorParameter {
  userId: string;
  email: string;
}

export type TEmailVarificationLinkGenerator = ({
  userId,
  email,
}: IEmailVarificationLinkGeneratorParameter) => string;

export interface IForgetPasswordLinkGeneratorParameter {
  userId: string;
  email: string;
}

export type TForgetPasswordLinkGenerator = ({
  userId,
  email,
}: IForgetPasswordLinkGeneratorParameter) => string;

export interface IErrorDetails {
  statusCode: number;
  message: string;
}