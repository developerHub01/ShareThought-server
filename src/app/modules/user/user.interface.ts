import { Model } from "mongoose";

export interface IUser {
  userName: string;
  fullName: string;
  avatar?: string;
  email: string;
  gender: "male" | "female";
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
}
