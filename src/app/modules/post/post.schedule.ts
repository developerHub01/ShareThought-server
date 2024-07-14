import schedule from "node-schedule";
import { PostModel } from "./post.model";

const handleSetPostSchedule = async (date: Date, postId: string) => {
  schedule.scheduleJob(date, async () => {
    const postData = await PostModel.findById(postId);

    const currentDate = new Date();
    currentDate.setSeconds(0, 0);

    const scheduledDate = postData?.scheduledTime;
    scheduledDate?.setSeconds(0, 0);

    if (
      !postData?.isPublished &&
      postData?.scheduledTime &&
      currentDate?.getTime() === scheduledDate?.getTime()
    ) {
      return await PostModel.findByIdAndUpdate(postId, {
        isPublished: true,
        publishedAt: currentDate,
        $unset: {
          scheduledTime: 1,
        },
      });
    }
  });
};

export const PostSchedule = { handleSetPostSchedule };
