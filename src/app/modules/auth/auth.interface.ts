export interface ILoginUser {
  email: string;
  password: string;
}
export interface IJWTPayload {
  userId?: string;
  channelId?: string
}