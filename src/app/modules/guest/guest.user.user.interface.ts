import { Model } from "mongoose";

export interface IGuestUser {}

export interface IGuestUserModel extends Model<IGuestUser> {
  isUserExist(guestId: string): Promise<boolean>;

  createGuestUser(): Promise<unknown>;

  deleteGuestUser(guestUserId: string, currentUserId: string): Promise<unknown>;
}
