import { UserModel } from "./../user/model/model";
import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { ILoginUser } from "./auth.interface";
import { AuthUtils } from "./auth.utils";
import config from "../../config";
import { GuestUserModel } from "../guest/model/model";
import path from "path";
import ejs from "ejs";
import sendEmail from "../../utils/sendEmail";
import { TDocumentType } from "../../interface/interface";
import { IUser } from "../user/user.interface";

const loginUser = async (payload: ILoginUser, guestId: string | undefined) => {
  const { password, email, userName } = payload;

  const user = await UserModel.findOne({
    ...(email ? { email } : { userName }),
  }).select({ password: 1 });

  if (!user)
    throw new AppError(httpStatus.NOT_FOUND, "This user is not found !");

  if (!(await UserModel.isPasswordMatch(password, user?.password)))
    throw new AppError(httpStatus.FORBIDDEN, "Password do not matched");

  const userId = user?._id?.toString();

  if (guestId) await GuestUserModel.deleteGuestUser(guestId, userId);

  const accessToken = AuthUtils.createToken(
    { userId },
    config?.JWT_ACCESS_SECRET as string,
    config?.JWT_ACCESS_EXPIRES_IN as string,
  );
  const refreshToken = AuthUtils.createToken(
    { userId },
    config?.JWT_REFRESH_SECRET as string,
    config?.JWT_REFRESH_EXPIRES_IN as string,
  );

  return {
    accessToken,
    refreshToken,
  };
};

const emailVerifyRequest = async (userId: string) => {
  const userData = await UserModel.findById(userId);
  if (!userData)
    throw new AppError(httpStatus.UNAUTHORIZED, "you are not authenticated");

  const { email, fullName } = userData;

  const verificationToken = AuthUtils.emailVerificationTokenGenerator({
    email,
    userId,
  });

  const verificationLink = `${config.CLIENT_BASE_URL}/auth/email_verify?token=${verificationToken}`;

  const templatePath = path.join(
    __dirname,
    "../../../views/EmailVarification.ejs",
  );

  const htmlEmailTemplate = await ejs.renderFile(templatePath, {
    VERIFICATION_LINK: verificationLink,
    FULL_NAME: fullName,
  });

  await sendEmail({
    from: config.ADMIN_USER_EMAIL,
    to: email,
    subject: "Share Thought Email Varification",
    text: "Verify your email address to full access Share Thought functionalities",
    html: htmlEmailTemplate, // html body
  });
};

const verifyEmail = async (userId: string, token: string) => {
  const userData = (await UserModel.findById(userId)) as TDocumentType<IUser>;

  // const tokenData = await
  const tokenData = AuthUtils.verifyToken(
    token,
    config.JWT_EMAIL_VERIFICATION_SECRET,
    {
      statusCode: httpStatus.UNAUTHORIZED,
      message: "Try to login again or retry to verify",
    },
  );

  if (!tokenData)
    throw new AppError(httpStatus.BAD_REQUEST, "Token data is not valid");

  const { email } = userData;

  if (userId !== tokenData.userId || email !== tokenData.email)
    throw new AppError(httpStatus.BAD_REQUEST, "Token data is not valid");

  const updatedUser = (await UserModel.findByIdAndUpdate(
    userId,
    {
      isVerified: true,
    },
    { new: true },
  )) as TDocumentType<IUser>;

  if (!updatedUser)
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Something went wrong when updating",
    );

  return updatedUser;
};

export const AuthServices = {
  loginUser,
  emailVerifyRequest,
  verifyEmail,
};
