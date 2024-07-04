import { Model } from "mongoose";

export interface IUser {
  userName: string;
  fullName: string;
  avatar?: string;
  email: string;
  gender: "male" | "female";
  password: string;
}

export interface IUserModel extends Model<IUser> {
  isPasswordMatch(
    plainPassword: string,
    hashedPassword: string,
  ): Promise<boolean>;
  isUserExist(id: string): Promise<boolean>;
}
