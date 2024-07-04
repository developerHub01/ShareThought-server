import errorHandler from "../../errors/errorHandler";
import { IUser } from "./user.interface";
import { UserModel } from "./user.model";

const createUser = async (payload: IUser) => {
  try {
    const result = await UserModel.create({
      ...payload,
    });
    return result;
  } catch (error) {
    errorHandler(error);
  }
};

export const UserServices = {
  createUser,
};
