import httpStatus from "http-status";
import catchAsync from "../../utils/catch.async";
import { sendResponse } from "../../utils/send.response";
import { IRequestWithActiveDetails } from "../../interface/interface";
import { SavedCategoryServices } from "./saved.category.services";

const findSavedCategory = catchAsync(async (req, res) => {
  const { userId } = req as IRequestWithActiveDetails;

  const result = await SavedCategoryServices.findSavedCategory({
    query: req.query,
    userId,
  });

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

  const result = await SavedCategoryServices.addToSaveCategory({
    categoryId,
    userId,
  });

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

  const result = await SavedCategoryServices.removeFromSaveCategoryByCategoryId(
    {
      categoryId,
      userId,
    },
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
    await SavedCategoryServices.removeFromSaveCategoryBySavedCategoryId({
      id: savedCategoryId,
      userId,
    });

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
