import AppError from "../errors/AppError";
import httpStatus from "http-status";
import { IRequestWithActiveDetails } from "../interface/interface";
import catchAsync from "../utils/catch.async";
import { CategoryModel } from "../modules/category/model/model";

const isMyCategory = catchAsync(async (req, res, next) => {
  const { id: categoryId } = req.params;
  const { channelId } = req as IRequestWithActiveDetails;

  if (!channelId)
    throw new AppError(httpStatus.UNAUTHORIZED, "This is not your channel");

  const result = await CategoryModel.isMyCategory(categoryId, channelId);

  if (!result)
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      "This is not your channel category",
    );

  return next();
});

export default isMyCategory;
