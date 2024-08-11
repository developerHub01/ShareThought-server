const userKey = (key: string) => `user:${key}`;

const postKey = (key: string) => `post:${key}`;

const communityPostkey = (key: string) => `community:post:${key}`;

export const RedisKeys = {
  userKey,
  postKey,
  communityPostkey,
};
