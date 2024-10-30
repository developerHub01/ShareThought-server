import { CommunityPostModel } from "../../../modules/community.post/model/model";
import { PostModel } from "../../../modules/post/model/model";

const scheduleBlogPost = async (job: { postId: string }) => {
  const { postId } = job;

  return await PostModel.findByIdAndUpdate(
    postId,
    {
      $unset: { scheduledTime: 1 },
      isPublished: true,
      publishedAt: new Date(),
    },
    { new: true },
  );
};

const scheduleCommunityPost = async (job: { postId: string }) => {
  const { postId } = job;

  return await CommunityPostModel.findByIdAndUpdate(
    postId,
    {
      $unset: { scheduledTime: 1 },
      isPublished: true,
      publishedAt: new Date(),
    },
    { new: true },
  );
};

export const PostScheduleServices = {
  scheduleBlogPost,
  scheduleCommunityPost,
};
