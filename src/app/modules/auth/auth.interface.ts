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
