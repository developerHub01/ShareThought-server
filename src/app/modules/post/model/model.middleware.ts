import { PostSchedule } from "../../post.schedule/post.schedule";
import { IPost } from "../post.interface";
import postSchema from "./model.schema";

postSchema.pre<IPost>("save", async function (next) {
  if (this.isPublished) {
    this.publishedAt = new Date();
    return next();
  }

  if (!this.scheduledTime) return next();

  let currentTime = new Date();
  currentTime.setSeconds(0, 0);
  (currentTime as unknown) = currentTime?.getTime();

  let scheduledTime = new Date(this?.scheduledTime);
  scheduledTime?.setSeconds(0, 0);
  (scheduledTime as unknown) = scheduledTime?.getTime();

  /* if schedule date was past */
  if (scheduledTime && scheduledTime <= currentTime) {
    this.publishedAt = new Date();
    this.isPublished = true;
    this.scheduledTime = undefined;
    return next();
  }

  next();
});

/* handle schedule after saving post */
postSchema.post<IPost>("save", async function (doc) {
  if (!doc.isPublished && doc.scheduledTime) {
    await PostSchedule.handleSetPostSchedule(
      doc.scheduledTime,
      (doc as typeof doc & { _id: string })?._id?.toString(),
      "blogPost",
    );
  }
});

/* handle schedule when updating post */
postSchema.pre("findOneAndUpdate", async function () {
  const update = this.getUpdate();

  const updatedData: Partial<typeof update> = {};

  const { isPublished, publishedAt } = update as typeof update & {
    isPublished?: boolean;
    publishedAt?: Date;
  };
  let { scheduledTime } = update as typeof update & {
    scheduledTime: Date;
  };

  let currentTime = new Date();
  currentTime.setSeconds(0, 0);
  (currentTime as unknown) = currentTime?.getTime();

  if (scheduledTime) {
    scheduledTime = new Date(scheduledTime);
    scheduledTime?.setSeconds(0, 0);
    (scheduledTime as unknown) = scheduledTime?.getTime();
  }

  if (isPublished) updatedData.scheduledTime = undefined;
  else if (scheduledTime && scheduledTime <= currentTime) {
    if (!publishedAt) updatedData.publishedAt = new Date();
    updatedData.isPublished = true;
    updatedData.scheduledTime = undefined;
  } else {
    updatedData.isPublished = false;
    await PostSchedule.handleSetPostSchedule(
      scheduledTime,
      (update as typeof update & { _id: string })?._id?.toString(),
      "blogPost",
    );
  }

  this.setUpdate({ ...update, ...updatedData });
});
