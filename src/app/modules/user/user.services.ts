import QueryBuilder from "../../builder/QueryBuilder";
import errorHandler from "../../errors/errorHandler";
import { UserConstant } from "./user.constant";
import { IUser, IUserChangePassword } from "./user.interface";
import { UserModel } from "./user.model";

const findUser = async (query: Record<string, unknown>) => {
  try {
    const userQuery = new QueryBuilder(UserModel.find({}), query)
      .search(UserConstant.userSearchableField)
      .filter()
      .sort()
      .paginate()
      .fields();

    const meta = await userQuery.countTotal();
    const result = await userQuery.modelQuery;

    return {
      meta,
      result,
    };
  } catch (error) {
    errorHandler(error);
  }
};

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

const updateUser = async (payload: Partial<IUser>, id: string) => {
  try {
    const result = await UserModel.findByIdAndUpdate(
      id,
      {
        ...payload,
      },
      { new: true },
    );
    return result;
  } catch (error) {
    errorHandler(error);
  }
};
const updateUserPassword = async (
  payload: IUserChangePassword,
  userId: string,
) => {
  try {
    return await UserModel.changePassword(payload, userId);
  } catch (error) {
    errorHandler(error);
  }
};

export const UserServices = {
  findUser,
  createUser,
  updateUser,
  updateUserPassword,
};
