const userKey = (key: string) => `user:${key}`;

const postKey = (key: string) => `post:${key}`;

const channelKey = (key: string) => `channel:${key}`;

const communityPostkey = (key: string) => `community_post:${key}`;

const communityPostSelectionKey = (key: string) =>
  `community_post_selection:${key}`;

const cummunityPostSelectionField = (
  userOrChannelId: string,
  userType: "channelId" | "userId",
) => `${userType}:${userOrChannelId}`;

const requestCountKey = (userIP: string, prefix: string) =>
  `request_count:${userIP}:${prefix}`;

const channelFollowersCount = (channelId: string)=> `followers_count:${channelId}`;

const channelModeratorsCount = (channelId: string) =>
  `moderator_count:${channelId}`;

export const RedisKeys = {
  userKey,
  channelKey,
  postKey,
  communityPostkey,
  communityPostSelectionKey,
  cummunityPostSelectionField,
  requestCountKey,
  channelFollowersCount,
  channelModeratorsCount,
};
