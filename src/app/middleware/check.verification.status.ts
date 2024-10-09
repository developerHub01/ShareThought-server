import catchAsync from "../utils/catch.async";
import { UserModel } from "../modules/user/model/model";
import { IRequestWithActiveDetails } from "../interface/interface";

const checkVerficationStatus = catchAsync(async (req, res, next) => {
  const { userId } = req as IRequestWithActiveDetails;

  const result = await UserModel.isVerified(userId);

  (req as IRequestWithActiveDetails).isVerified = result;

  return next();
});

export default checkVerficationStatus;
