import catchAsync from "../../utils/catch.async";
import { imageUpload } from "../../utils/multer.image.upload";

const createOrUpdateUserAvatar = imageUpload.fields([
  {
    name: "avatar",
    maxCount: 1,
  },
]);

const matchReqBodyFilesWithValidationSchema = catchAsync(
  async (req, res, next) => {
    let avatarPath;

    console.log(req.body.avatar);

    if (req?.body?.avatar?.length) avatarPath = req?.body?.avatar[0];

    if (avatarPath) req.body.avatar = avatarPath;

    console.log({ avatarPath });
    console.log(req.body);

    next();
  },
);

export const UserMiddleware = {
  createOrUpdateUserAvatar,
  matchReqBodyFilesWithValidationSchema,
};
