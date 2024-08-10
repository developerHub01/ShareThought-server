import { redis } from "../../../app";
import { DocumentType } from "../../interface/interface";
import { RedisKeys } from "../../redis.keys";
import { IUser, IUserChangePassword } from "./user.interface";
import { UserServices } from "./user.services";

const findUserById = async (userId: string) => {
  const userKey = RedisKeys.userKeys(userId);
  const userData = await redis.get(userKey);

  if (userData) return JSON.parse(userData);

  const result = await UserServices.findUserById(userId);

  await redis.set(userKey, JSON.stringify(result));

  return result;
};

const createUser = async (payload: IUser) => {
  const result = (await UserServices.createUser(
    payload,
  )) as DocumentType<IUser>;

  const userKey = RedisKeys.userKeys(result?._id?.toString());

  await redis.set(userKey, JSON.stringify(result));

  return result;
};

const updateUser = async (payload: IUser, userId: string) => {
  const result = (await UserServices.updateUser(
    payload,
    userId,
  )) as DocumentType<IUser>;

  const userKey = RedisKeys.userKeys(result?._id?.toString());

  await redis.set(userKey, JSON.stringify(result));

  return result;
};

const updateUserPassword = async (
  payload: IUserChangePassword,
  userId: string,
) => {
  const result = (await UserServices.updateUserPassword(
    payload,
    userId,
  )) as DocumentType<IUser>;

  const userKey = RedisKeys.userKeys(result?._id?.toString());

  await redis.set(userKey, JSON.stringify(result));

  return result;
};

export const UserCache = {
  findUserById,
  createUser,
  updateUser,
  updateUserPassword,
};
