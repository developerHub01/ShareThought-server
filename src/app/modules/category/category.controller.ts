import httpStatus from "http-status";
import catchAsync from "../../utils/catch.async";
import { sendResponse } from "../../utils/send.response";
import { CategoryServices } from "./category.services";
import { IRequestWithActiveDetails } from "../../interface/interface";

const findCategoryById = catchAsync(async (req, res) => {
  const { id: categoryId } = req.params;

  const result =
    (await CategoryServices.findCategoryById({ categoryId })) || {};

  const { name } = result as typeof result & { name: string };
  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: name
      ? `${name} category found succesfully`
      : "category not found succesfully",
    data: result,
  });
});

const findCategoryByChannelId = catchAsync(async (req, res) => {
  const { id: channelId } = req.params;

  const { channelId: myChannelId } = req as IRequestWithActiveDetails;

  const result = await CategoryServices.findCategoryByChannelId({
    query: req.query,
    channelId,
    myChannelId: myChannelId as string,
  });

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: `category of channel ${channelId} found succesfully`,
    data: result,
  });
});

const createCategory = catchAsync(async (req, res) => {
  const { channelId } = req as IRequestWithActiveDetails;

  req.body.channelId = channelId;

  const result = await CategoryServices.createCategory(req.body);

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "category created succesfully",
    data: result,
  });
});

const updateCategory = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await CategoryServices.updateCategory({
    payload: req.body,
    categoryId: id,
  });

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "category updated succesfully",
    data: result,
  });
});

const addPostInCategory = catchAsync(async (req, res) => {
  const { id: categoryId, postId } = req.params;

  const result = await CategoryServices.addPostInCategory({
    categoryId,
    postId,
  });

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "post added in category succesfully",
    data: result,
  });
});

const removePostFromCategory = catchAsync(async (req, res) => {
  const { id: categoryId, postId } = req.params;

  const result = await CategoryServices.removePostFromCategory({
    categoryId,
    postId,
  });

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "removed post from category succesfully",
    data: result,
  });
});

const deleteCategory = catchAsync(async (req, res) => {
  const { id: categoryId } = req.params;

  const result = await CategoryServices.deleteCategory({ categoryId });

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "category deleted succesfully",
    data: result,
  });
});

export const CategoryController = {
  findCategoryById,
  findCategoryByChannelId,
  createCategory,
  updateCategory,
  addPostInCategory,
  removePostFromCategory,
  deleteCategory,
};
