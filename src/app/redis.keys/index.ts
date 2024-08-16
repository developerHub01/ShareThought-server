const userKey = (key: string) => `user:${key}`;

const postKey = (key: string) => `post:${key}`;

const communityPostkey = (key: string) => `community_post:${key}`;

const communityPostSelectionKey = (key: string) =>
  `community_post_selection:${key}`;

const cummunityPostSelectionField = (
  userOrChannelId: string,
  userType: "channelId" | "userId",
) => `${userType}:${userOrChannelId}`;

export const RedisKeys = {
  userKey,
  postKey,
  communityPostkey,
  communityPostSelectionKey,
  cummunityPostSelectionField,
};
