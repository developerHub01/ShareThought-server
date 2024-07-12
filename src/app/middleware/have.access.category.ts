import AppError from "../errors/AppError";
import httpStatus from "http-status";
import { IRequestWithUserId } from "../interface/interface";
import catchAsync from "../utils/catch.async";
import { CategoryModel } from "../modules/category/category.model";

const haveAccessCategory = catchAsync(async (req, res, next) => {
  const { id: categoryId } = req.params;
  const { userId } = req as IRequestWithUserId;


  const result = await CategoryModel.haveAccessCategory(categoryId, userId);

  if (!result)
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      "This is not your channel category",
    );

  return next();
});

export default haveAccessCategory;
