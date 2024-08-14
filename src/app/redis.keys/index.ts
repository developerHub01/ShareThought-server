const userKey = (key: string) => `user:${key}`;

const postKey = (key: string) => `post:${key}`;

const communityPostkey = (key: string) => `community:post:${key}`;

const cummunityPostSelectionKey = (
  postId: string,
  userId: string,
  userType: "channelId" | "userId",
) => `community:post:${postId}:user:${userId}:userType:${userType}`;

export const RedisKeys = {
  userKey,
  postKey,
  communityPostkey,
  cummunityPostSelectionKey,
};
