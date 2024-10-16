import config from "../config";

const REACTION_TYPES = {
  LIKE: "LIKE",
  LOVE: "LOVE",
  WOW: "WOW",
  CLAP: "CLAP",
  HELPFUL: "HELPFUL",
  INSPIRING: "INSPIRING",
};

const TOKENS = {
  ACCESS_TOKEN: "access_token",
  REFRESH_TOKEN: "refresh_token",
  CHANNEL_TOKEN: "channel_token",
  GUEST_TOKEN: "guest_token",
  MODERATOR_TOKEN: "moderator_token",
  EMAIL_VERIFICATION_TOKEN: "email_verification_token",
  FORGET_PASSWORD_TOKEN: "forget_password_token",
};

const LOCATION_API = (ip: string) =>
  `${config.LOCATION_API_PREFIX}/${ip}?access_key=${config.LOCATION_API_KEY}`;

export const Constatnt = {
  TOKENS,
  REACTION_TYPES,
  LOCATION_API,
};
