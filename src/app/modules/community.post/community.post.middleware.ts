import errorHandler from "../../errors/errorHandler";
import catchAsync from "../../utils/catch.async";
import { imageUpload } from "../../utils/multer.image.upload";
import { validateSchema } from "../../utils/validate.schema";
import { CommunityPostConstant } from "./community.post.constant";
import { CommunityPostValidation } from "./community.post.validation";

const createOrUpdatePostImages = imageUpload.fields([
  {
    name: "images",
  },
]);

const handleCreatePostImagesWithContent = catchAsync(async (req, res, next) => {
  try {
    const { postType, images, details } = req.body;

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
        const result = await validateSchema(
          CommunityPostValidation.postQuizDetailsValidationSchema,
          details,
        );

        console.log({ result });

        req.body.postQuizDetails = details;

        break;
      }
      case CommunityPostConstant.COMMUNITY_POST_TYPES.POLL: {
        break;
      }
      case CommunityPostConstant.COMMUNITY_POST_TYPES.POLL_WITH_IMAGE: {
        break;
      }
      default: {
        req.body.details = undefined;
        req.body.images = undefined;
      }
    }

    console.log(req.body);
    

    const result = await validateSchema(
      CommunityPostValidation.createPostValidationSchema,
      req.body,
    );

    console.log(result);
    // next();
  } catch (error) {
    errorHandler(error);
  }
});

export const CommunityPostMiddleware = {
  createOrUpdatePostImages,
  handleCreatePostImagesWithContent,
};
