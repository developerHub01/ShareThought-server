const userKey = (key: string) => `user:${key}`;

const postKey = (key: string) => `post:${key}`;

export const RedisKeys = {
  userKey,
  postKey,
};
