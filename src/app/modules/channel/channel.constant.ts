const CHANNEL_COLLECTION_NAME = "Channel";

const CHANNEL_SEARCHABLE_FIELD: Array<string> = [
  "channelName",
  "channelDescription",
];

const POST_REDIS_TTL = 24 * 60 * 60;
const CHANNEL_MODERATOR_COUNT_TTL = 24 * 60 * 60;

const CHANNEL_NAME_MAX_LENGTH = 50;
const CHANNEL_NAME_MIN_LENGTH = 1;
const CHANNEL_DESCRIPTION_MAX_LENGTH = 250;

const CHANNEL_DEFAULT_COVER_LIST = [
  "https://res.cloudinary.com/ddof4ku9y/image/upload/v1722025201/shareThought/channel/cover_placeholder/1.jpg",
  "https://res.cloudinary.com/ddof4ku9y/image/upload/v1729001661/shareThought/channel/cover_placeholder/2.jpg",
  "https://res.cloudinary.com/ddof4ku9y/image/upload/v1722025199/shareThought/channel/cover_placeholder/3.jpg",
  "https://res.cloudinary.com/ddof4ku9y/image/upload/v1721171199/shareThought/channel/cover_placeholder/4.jpg",
  "https://res.cloudinary.com/ddof4ku9y/image/upload/v1721171199/shareThought/channel/cover_placeholder/5.jpg",
];

const CHANNEL_DEFAULT_COVER = () =>
  ChannelConstant.CHANNEL_DEFAULT_COVER_LIST[Math.ceil(Math.random() * 5)];

const CHANNEL_AVATAR_SIZE = {
  WIDTH: 400,
  HEIGHT: 400,
};

const CHANNEL_COVER_SIZE = {
  WIDTH: 400,
  HEIGHT: 400,
};

const CHANNEL_USER_ROLES = {
  AUTHOR: "AUTHOR",
  SUPER_MODERATOR: "SUPER_MODERATOR",
  NORMAL_MODERATOR: "NORMAL_MODERATOR",
} as const;

export const ChannelConstant = {
  CHANNEL_COLLECTION_NAME,
  POST_REDIS_TTL,
  CHANNEL_MODERATOR_COUNT_TTL,
  CHANNEL_NAME_MAX_LENGTH,
  CHANNEL_NAME_MIN_LENGTH,
  CHANNEL_DESCRIPTION_MAX_LENGTH,
  CHANNEL_DEFAULT_COVER_LIST,
  CHANNEL_DEFAULT_COVER,
  CHANNEL_SEARCHABLE_FIELD,
  CHANNEL_AVATAR_SIZE,
  CHANNEL_COVER_SIZE,
  CHANNEL_USER_ROLES,
};
