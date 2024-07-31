import schedule from "node-schedule";
import { TPostType } from "../../interface/interface";
import { PostModel } from "../post/model/model";
import { CommunityPostModel } from "../community.post/model/model";

const handleSetPostSchedule = async (
  date: Date,
  postId: string,
  postType: TPostType,
) => {
  schedule.scheduleJob(date, async () => {
    const postData =
      postType === "blogPost"
        ? await PostModel.findById(postId)
        : await CommunityPostModel.findById(postId);

    const currentDate = new Date();
    currentDate.setSeconds(0, 0);

    const scheduledDate = postData?.scheduledTime;
    scheduledDate?.setSeconds(0, 0);

    if (
      !postData?.isPublished &&
      postData?.scheduledTime &&
      currentDate?.getTime() === scheduledDate?.getTime()
    ) {
      const updateData = {
        isPublished: true,
        publishedAt: currentDate,
        $unset: {
          scheduledTime: 1,
        },
      };

      return postType === "blogPost"
        ? await PostModel.findByIdAndUpdate(postId, updateData)
        : await CommunityPostModel.findByIdAndUpdate(postId, updateData);
    }
  });
};

export const PostSchedule = { handleSetPostSchedule };
