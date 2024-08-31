import { getStaticFileURL } from "../../utils/get.static.file.url";

const CHANNEL_COLLECTION_NAME = "Channel";

const CHANNEL_SEARCHABLE_FIELD: Array<string> = [
  "channelName",
  "channelDescription",
];

const POST_REDIS_TTL = 24 * 60 * 60;

const CHANNEL_NAME_MAX_LENGTH = 50;
const CHANNEL_NAME_MIN_LENGTH = 1;
const CHANNEL_DESCRIPTION_MAX_LENGTH = 250;
const CHANNEL_DEFAULT_COVER = getStaticFileURL(
  "cover_placeholder",
  Math.ceil(Math.random() * 5) + ".jpg",
);

const CHANNEL_AVATAR_SIZE = {
  WIDTH: 400,
  HEIGHT: 400,
};

const CHANNEL_COVER_SIZE = {
  WIDTH: 400,
  HEIGHT: 400,
};

export const ChannelConstant = {
  CHANNEL_COLLECTION_NAME,
  POST_REDIS_TTL,
  CHANNEL_NAME_MAX_LENGTH,
  CHANNEL_NAME_MIN_LENGTH,
  CHANNEL_DESCRIPTION_MAX_LENGTH,
  CHANNEL_DEFAULT_COVER,
  CHANNEL_SEARCHABLE_FIELD,
  CHANNEL_AVATAR_SIZE,
  CHANNEL_COVER_SIZE,
};
