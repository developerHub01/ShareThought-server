import AppError from "../errors/AppError";
import httpStatus from "http-status";
import { IRequestWithActiveDetails } from "../interface/interface";
import catchAsync from "../utils/catch.async";
import { CategoryModel } from "../modules/category/model/model";

const haveAccessCategory = catchAsync(async (req, res, next) => {
  const { id: categoryId } = req.params;
  const { userId, channelId } = req as IRequestWithActiveDetails;

  const result = await CategoryModel.haveAccessCategory({
    categoryId,
    userOrChannelId: channelId || userId,
    idType: channelId ? "channelId" : "userId",
  });

  if (!result)
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      "This is not your channel category",
    );

  return next();
});

export default haveAccessCategory;
