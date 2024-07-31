import httpStatus from "http-status";
import catchAsync from "../../utils/catch.async";
import { sendResponse } from "../../utils/send.response";
import { SearchHistoryServices } from "./search.history.services";
import { IRequestWithActiveDetails } from "../../interface/interface";
import { SearchHistoryModel } from "./model/model";

export const findSearchHistory = catchAsync(async (req, res) => {
  const { searchTerm } = req.query;
  const { userId } = req as IRequestWithActiveDetails;

  if (searchTerm && typeof searchTerm === "string")
    await SearchHistoryModel.addToSearchList(searchTerm, userId);

  const result = await SearchHistoryServices.findSearchHistory(req.query);

  if (result && result?.result)
    (result.result as unknown as string[]) = result?.result?.map(
      ({ searchTerm }) => searchTerm,
    );

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "post deleted succesfully",
    data: result,
  });
});

export const SearchHistoryController = {
  findSearchHistory,
};
