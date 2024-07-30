import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import errorHandler from "../../errors/errorHandler";
import catchAsync from "../../utils/catch.async";
import { imageUpload } from "../../utils/multer.image.upload";
import { CommunityPostConstant } from "./community.post.constant";

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
          if (!images || !images?.length) break;

          req.body.postImageDetails = {
            image: images[0],
          };

          break;
        }
        case CommunityPostConstant.COMMUNITY_POST_TYPES.POST_SHARE: {
          if (!details || !details?.postId) break;

          req.body.postSharedPostDetails = {
            postId: details.postId,
          };

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
            const detailsData = JSON.parse(details);

            if (detailsData?.options?.length !== images?.length)
              throw new AppError(
                httpStatus.BAD_REQUEST,
                "post details is not valid",
              );

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
