import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import errorHandler from "../../errors/errorHandler";
import catchAsync from "../../utils/catch.async";
import { imageUpload } from "../../utils/multer.image.upload";
import { CommunityPostConstant } from "./community.post.constant";
import { CloudinaryConstant } from "../../constants/cloudinary.constant";
import { CommunityPostUtils } from "./community.post.utils";

const createOrUpdatePostImages = imageUpload.fields([
  {
    name: "images",
  },
]);

const matchReqBodyFilesWithValidationSchema = catchAsync(
  async (req, res, next) => {
    try {
      const { postType, images, details } = req.body;

      delete req.body["postImageDetails"];
      delete req.body["postSharedPostDetails"];
      delete req.body["postQuizDetails"];
      delete req.body["postPollDetails"];
      delete req.body["postPollWithImageDetails"];

      switch (postType) {
        case CommunityPostConstant.COMMUNITY_POST_TYPES.IMAGE: {
          if (!images || !images?.length)
            throw new AppError(httpStatus.BAD_REQUEST, "image not found");

          images[0] = await CommunityPostUtils.createOrUpdatePostImage(
            req.body?.images[0],
            postType,
            CloudinaryConstant.SHARE_THOUGHT_COMMUNITY_POST_IMAGE_POST_FOLDER_NAME,
            false,
          );

          req.body.postImageDetails = {
            image: images[0],
          };

          break;
        }
        case CommunityPostConstant.COMMUNITY_POST_TYPES.POST_SHARE: {
          try {
            const detailsData = JSON.parse(details);

            if (!detailsData || !detailsData?.postId) break;

            req.body.postSharedPostDetails = {
              postId: detailsData.postId,
            };
          } catch (error) {
            throw new AppError(
              httpStatus.BAD_REQUEST,
              "post details is not valid",
            );
          }

          break;
        }
        case CommunityPostConstant.COMMUNITY_POST_TYPES.QUIZ: {
          try {
            req.body.postQuizDetails = JSON.parse(details);
          } catch (error) {
            throw new AppError(
              httpStatus.BAD_REQUEST,
              "post details is not valid",
            );
          }

          break;
        }
        case CommunityPostConstant.COMMUNITY_POST_TYPES.POLL: {
          try {
            req.body.postPollDetails = JSON.parse(details);
          } catch (error) {
            throw new AppError(
              httpStatus.BAD_REQUEST,
              "post details is not valid",
            );
          }

          break;
        }
        case CommunityPostConstant.COMMUNITY_POST_TYPES.POLL_WITH_IMAGE: {
          try {
            if (!images)
              throw new AppError(httpStatus.BAD_REQUEST, "images not found");

            const detailsData = JSON.parse(details);

            if (detailsData?.options?.length !== images?.length)
              throw new AppError(
                httpStatus.BAD_REQUEST,
                "post details is not valid",
              );

            for (const index in images) {
              images[index] = await CommunityPostUtils.createOrUpdatePostImage(
                images[index],
                postType,
                CloudinaryConstant.SHARE_THOUGHT_COMMUNITY_POST_POLL_POST_FOLDER_NAME,
                false,
              );
            }

            images.map((image: string, index: number) => {
              if (
                typeof detailsData?.options[index] === "object" &&
                detailsData?.options[index] !== null
              )
                detailsData.options[index].image = image;
            });

            req.body.postPollWithImageDetails = detailsData;
          } catch (error) {
            throw new AppError(
              httpStatus.BAD_REQUEST,
              "post details is not valid",
            );
          }

          break;
        }
      }

      delete req.body["details"];
      delete req.body["images"];

      next();
    } catch (error) {
      errorHandler(error);
    }
  },
);

export const CommunityPostMiddleware = {
  createOrUpdatePostImages,
  matchReqBodyFilesWithValidationSchema,
};
