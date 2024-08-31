import { HistoryItemModel } from "../../history/model/item.model";
import { HistorySettingModel } from "../../history/model/setting.model";
import { UserModel } from "../../user/model/model";
import { GuestUserModel } from "./model";
import guestUserSchema from "./model.schema";

guestUserSchema.statics.isUserExist = async (
  guestId: string,
): Promise<boolean> => {
  return Boolean(await GuestUserModel.findById(guestId));
};

guestUserSchema.statics.createGuestUser = async () => {
  return await GuestUserModel.create({});
};

guestUserSchema.statics.deleteGuestUser = async (
  guestUserId: string,
  currentUserId: string,
) => {
  if (
    !(await GuestUserModel.findById(guestUserId)) ||
    !(await UserModel.findById(currentUserId))
  )
    return;

  let guestHistory = await HistoryItemModel.find({
    userId: guestUserId,
    userType: "guest",
  });

  (guestHistory as unknown) = guestHistory.map((history) => ({
    ...history,
    userId: currentUserId,
    userType: "user",
  }));

  await HistorySettingModel.findOneAndDelete({
    userId: guestUserId,
    userType: "guest",
  });

  await HistoryItemModel.deleteMany({ userId: guestUserId });

  await GuestUserModel.findByIdAndDelete(guestUserId);

  return await HistoryItemModel.insertMany(guestHistory);
};
