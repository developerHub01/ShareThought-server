import errorHandler from "../../../errors/errorHandler";
import { HistoryItemModel } from "../../history/model/item.model";
import { HistorySettingModel } from "../../history/model/setting.model";
import { UserModel } from "../../user/model/model";
import { GuestUserModel } from "./model";
import guestUserSchema from "./model.schema";

guestUserSchema.statics.isUserExist = async (
  guestId: string,
): Promise<boolean> => {
  try {
    return Boolean(await GuestUserModel.findById(guestId));
  } catch (error) {
    return errorHandler(error);
  }
};

guestUserSchema.statics.createGuestUser = async () => {
  try {
    return await GuestUserModel.create({});
  } catch (error) {
    return errorHandler(error);
  }
};

guestUserSchema.statics.deleteGuestUser = async (
  guestUserId: string,
  currentUserId: string,
) => {
  console.log({ guestUserId, currentUserId });

  try {
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

    console.log({ guestHistory });

    await HistorySettingModel.findOneAndDelete({
      userId: guestUserId,
      userType: "guest",
    });

    await HistoryItemModel.deleteMany({ userId: guestUserId });

    await GuestUserModel.findByIdAndDelete(guestUserId);

    return await HistoryItemModel.insertMany(guestHistory);
  } catch (error) {
    return errorHandler(error);
  }
};
