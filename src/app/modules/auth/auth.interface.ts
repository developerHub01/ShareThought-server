export interface ILoginUser {
  email?: string;
  userName?: string;
  password: string;
}

export interface IJWTPayload {
  userId?: string;
  channelId?: string;
  guestId?: string;
}

interface IEmailVarificationLinkGeneratorParameter {
  userId: string;
  email: string;
}

export type TEmailVarificationLinkGenerator = ({
  userId,
  email,
}: IEmailVarificationLinkGeneratorParameter) => string;

export interface IErrorDetails {
  statusCode: number;
  message: string;
}