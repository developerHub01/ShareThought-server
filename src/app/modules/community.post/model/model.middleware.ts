import httpStatus from "http-status";
import communityPostSchema from "./model.schema";
import { ICommunityPost } from "../community.post.interface";
import AppError from "../../../errors/AppError";
import { PostSchedule } from "../../post.schedule/post.schedule";

communityPostSchema.pre<ICommunityPost>("save", async function (next) {
  if (this.scheduledTime && this.isPublished)
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "scheduled post can't be public",
    );

  if (!this.scheduledTime && !this.isPublished)
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "post have to be public or scheduled",
    );

  /* Checking is there multiple type or not */
  if (
    Number(!!this.postImageDetails) +
      Number(!!this.postSharedPostDetails) +
      Number(!!this.postPollDetails) +
      Number(!!this.postPollWithImageDetails) +
      Number(!!this.postQuizDetails) >
    1
  )
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Only one post type can be provided",
    );

  if (this.postPollDetails || this.postPollWithImageDetails) {
    const totalPolledUsers =
      (this.postPollDetails || this.postPollWithImageDetails)?.options?.reduce(
        (acc, curr) => {
          if (curr?.participateList) acc += curr?.participateList?.length;

          return acc;
        },
        0,
      ) || 0;

    if (totalPolledUsers)
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "user can't select poll when creating a poll",
      );
  } else if (this.postQuizDetails) {
    /* Validation of poastQuiz =============== */
    const initialCounts = {
      currectAnswerCount: 0,
      currectAnswerExplainationCount: 0,
      answeredUsersCount: 0,
    };

    const {
      currectAnswerCount,
      currectAnswerExplainationCount,
      answeredUsersCount,
    } = this.postQuizDetails?.options?.reduce(
      (acc, curr) => {
        if (!curr?.isCurrectAnswer && curr.currectAnswerExplaination)
          throw new AppError(
            httpStatus.BAD_REQUEST,
            "quiz options wrong ans can't have explaination",
          );

        if (curr?.isCurrectAnswer) acc.currectAnswerCount++;

        if (curr?.currectAnswerExplaination)
          acc.currectAnswerExplainationCount++;

        if (curr?.participateList)
          acc.answeredUsersCount += curr?.participateList.length;

        return acc;
      },
      {
        ...initialCounts,
      },
    ) || { ...initialCounts };

    if (currectAnswerCount !== 1)
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "quiz options must contain a currect answer",
      );

    if (currectAnswerExplainationCount > 1)
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "quiz options can contain maximum one answer explaination",
      );

    if (answeredUsersCount)
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "user can't answer when creating a quiz",
      );
  }

  return next();
});

/* handle schedule after saving post */
communityPostSchema.post<ICommunityPost>("save", async function (doc) {
  if (!doc.isPublished && doc.scheduledTime) {
    await PostSchedule.handleSetPostSchedule(
      doc.scheduledTime,
      (doc as typeof doc & { _id: string })?._id?.toString(),
      "communityPost",
    );
  }
});
