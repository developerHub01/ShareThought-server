import QueryBuilder from "../../builder/QueryBuilder";
import { UserModel } from "./model/model";
import { UserConstant } from "./user.constant";
import { IUser, IUserChangePassword } from "./user.interface";

const findUserById = async (userId: string) => {
  return await UserModel.findById(userId);
};

const findUser = async (query: Record<string, unknown>) => {
  const userQuery = new QueryBuilder(UserModel.find({}), query)
    .search(UserConstant.USER_SEARCHABLE_FIELD)
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
};

const createUser = async (payload: IUser) => {
  const result = await UserModel.create({
    ...payload,
  });
  return result;
};

const updateUser = async (payload: Partial<IUser>, id: string) => {
  const result = await UserModel.findByIdAndUpdate(
    id,
    {
      ...payload,
    },
    { new: true },
  );
  return result;
};

const updateUserPassword = async (
  payload: IUserChangePassword,
  userId: string,
) => {
  return await UserModel.updateUserPassword(payload, userId);
};

export const UserServices = {
  findUserById,
  findUser,
  createUser,
  updateUser,
  updateUserPassword,
};
