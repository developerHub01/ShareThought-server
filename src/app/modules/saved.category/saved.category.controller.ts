import httpStatus from "http-status";
import catchAsync from "../../utils/catch.async";
import { sendResponse } from "../../utils/send.response";
import { IRequestWithActiveDetails } from "../../interface/interface";
import { SavedCategoryServices } from "./saved.category.services";
import { SavedCategoryModel } from "./saved.category.model";

const findSavedCategory = catchAsync(async (req, res) => {
  const { userId } = req as IRequestWithActiveDetails;

  const result = await SavedCategoryServices.findSavedCategory(
    req.query,
    userId,
  );

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "my saved categories found succesfully succesfully!",
    data: result,
  });
});

const addToSaveCategory = catchAsync(async (req, res) => {
  const { userId } = req as IRequestWithActiveDetails;

  const { categoryId } = req.params;

  const result = await SavedCategoryModel.addToSaveCategory(categoryId, userId);

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "new category saved succesfully!",
    data: result,
  });
});

const removeFromSaveCategoryByCategoryId = catchAsync(async (req, res) => {
  const { userId } = req as IRequestWithActiveDetails;

  const { categoryId } = req.params;

  const result = await SavedCategoryModel.removeFromSaveCategoryByCategoryId(
    categoryId,
    userId,
  );

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "a category removed from saved list succesfully!",
    data: result,
  });
});

const removeFromSaveCategoryBySavedCategoryId = catchAsync(async (req, res) => {
  const { userId } = req as IRequestWithActiveDetails;

  const { savedCategoryId } = req.params;

  const result =
    await SavedCategoryModel.removeFromSaveCategoryBySavedCategoryId(
      savedCategoryId,
      userId,
    );

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "a category removed from saved list succesfully!",
    data: result,
  });
});

export const SavedCategoryController = {
  findSavedCategory,
  addToSaveCategory,
  removeFromSaveCategoryByCategoryId,
  removeFromSaveCategoryBySavedCategoryId,
};
