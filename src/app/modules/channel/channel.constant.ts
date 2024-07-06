import { getStaticFileURL } from "../../utils/get.static.file.url";

const CHANNEL_COLLECTION_NAME = "Channel";

const channelSearchableField: Array<string> = [
  "channelName",
  "channelDescription",
];

const CHANNEL_NAME_MAX_LENGTH = 50;
const CHANNEL_NAME_MIN_LENGTH = 1;
const CHANNEL_DESCRIPTION_MAX_LENGTH = 250;
const CHANNEL_DEFAULT_COVER = getStaticFileURL(
  "cover_placeholder",
  Math.ceil(Math.random() * 5) + ".jpg",
);

export const ChannelConstant = {
  CHANNEL_COLLECTION_NAME,
  CHANNEL_NAME_MAX_LENGTH,
  CHANNEL_NAME_MIN_LENGTH,
  CHANNEL_DESCRIPTION_MAX_LENGTH,
  CHANNEL_DEFAULT_COVER,
  channelSearchableField,
};
