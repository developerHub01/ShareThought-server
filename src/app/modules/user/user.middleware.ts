import { imageUpload } from "../../utils/multer.image.upload";

const UpdateUserAvatar = imageUpload.fields([
  {
    name: "avatar",
    maxCount: 1,
  },
]);

export const UserMiddleware = { UpdateUserAvatar };
