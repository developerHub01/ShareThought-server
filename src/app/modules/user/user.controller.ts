import httpStatus from "http-status";
import catchAsync from "../../utils/catch.async";
import { sendResponse } from "../../utils/send.response";
import { UserServices } from "./user.services";

const createUser = catchAsync(async (req, res) => {
  const result = await UserServices.createUser(req.body);

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "user created succesfully",
    data: result,
  });
});

export const UserController = {
  createUser,
};
