import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { ILoginUser } from "./auth.interface";
import { AuthUtils } from "./auth.utils";
import config from "../../config";
import { UserModel } from "../user/model/model";
import { GuestUserModel } from "../guest/model/model";

const loginUser = async (payload: ILoginUser, guestId: string | undefined) => {
  const { password, email } = payload;

  const user = await UserModel.findOne({
    email,
  }).select({ password: 1 });

  if (!user)
    throw new AppError(httpStatus.NOT_FOUND, "This user is not found !");

  if (!(await UserModel.isPasswordMatch(password, user?.password)))
    throw new AppError(httpStatus.FORBIDDEN, "Password do not matched");

  const userId = user?._id?.toString();

  if (guestId) await GuestUserModel.deleteGuestUser(guestId, userId);

  return AuthUtils.createToken(
    { userId },
    config?.JWT_SECRET as string,
    config?.JWT_ACCESS_EXPIRES_IN as string,
  );
};

export const AuthServices = {
  loginUser,
};
