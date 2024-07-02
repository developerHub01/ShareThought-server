import { IUser } from "./user.interface";
import { UserModel } from "./user.model";

const createUser = async (payload: IUser) => {
  try {
    const result = await UserModel.create({
      ...payload,
    });
    return result;
  } catch (error: any) {
    throw new Error(error);
  }
};

export const UserServices = {
  createUser,
};
