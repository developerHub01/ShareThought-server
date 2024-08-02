import { Model } from "mongoose";
import { UserConstant } from "./user.constant";

const genderTypesList: Array<string> = Object.values(UserConstant.GENDER_TYPES);

export type TGenderType = (typeof genderTypesList)[number];

export interface IUser {
  userName: string;
  fullName: string;
  avatar?: string;
  email: string;
  gender: TGenderType;
  password: string;
}
export interface IUserChangePassword {
  oldPassword: string;
  newPassword: string;
}

export interface IUserModel extends Model<IUser> {
  isPasswordMatch(
    plainPassword: string,
    hashedPassword: string,
  ): Promise<boolean>;

  createHash(str: string): Promise<string>;

  isUserExist(id: string): Promise<boolean>;

  changePassword(
    payload: IUserChangePassword,
    userId: string,
  ): Promise<unknown>;

  createGuestUser(): Promise<unknown>;

  deleteGuestUser(guestUserId: string, currentUserId: string): Promise<unknown>;
}
