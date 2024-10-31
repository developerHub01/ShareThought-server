import mongoose from "mongoose";
import QueryBuilder from "../../builder/QueryBuilder";
import { TAuthorType } from "../../interface/interface";
import { CommunityPostConstant } from "./community.post.constant";
import {
  ICommunityPost,
  ICommunityPostPollOption,
  ICommunityPostQuizOption,
  ICreateCommunityPost,
} from "./community.post.interface";
import { CommunityPostModel } from "./model/model";
import { CommentServices } from "../comment/comment.services";
import { PostReactionModel } from "../post.reaction/model/model";
import { CommentModel } from "../comment/model/model";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";
import { postScheduleQueue } from "../../queues/email/queue";
import { QueueJobList } from "../../queues";
const ObjectId = mongoose.Types.ObjectId;

/* helper function start =================== */
/*
 *  to find which index of option is selected from all options
 */
const postDetailsSelectedIndex = ({
  doc,
  userId,
}: {
  doc: ICommunityPost;
  userId: string;
}) => {
  const { postPollDetails, postPollWithImageDetails, postQuizDetails } = doc;

  const { options } =
    postPollDetails || postPollWithImageDetails || postQuizDetails || {};

  if (!options)
    throw new AppError(
      httpStatus.NOT_ACCEPTABLE,
      "selection is only possible in poll or quiz post",
    );

  return options.findIndex(
    (option: ICommunityPostQuizOption | ICommunityPostPollOption) => {
      return option["participateList"].includes(new ObjectId(userId));
    },
  );
};
/* helper function end =================== */

const findCommuityPosts = async ({
  query,
}: {
  query: Record<string, unknown>;
}) => {
  const postQuery = new QueryBuilder(
    CommunityPostModel.find({
      isPublished: true,
    }).populate({
      path: "channelId",
      select: "channelName channelAvatar",
    }),
    query,
  )
    .search(CommunityPostConstant.COMMUNITY_POST_SEARCHABLE_FIELD)
    .filter()
    .sort()
    .paginate()
    .fields();

  const meta = await postQuery.countTotal();
  const result = await postQuery.modelQuery;

  return {
    meta,
    result,
  };
};

const findCommuityPostsByChannelId = async ({
  query,
  channelId,
}: {
  query: Record<string, unknown>;
  channelId: string;
}) => {
  const postQuery = new QueryBuilder(
    CommunityPostModel.find({
      isPublished: true,
      channelId,
    }).populate({
      path: "channelId",
      select: "channelName channelAvatar",
    }),
    query,
  )
    .search(CommunityPostConstant.COMMUNITY_POST_SEARCHABLE_FIELD)
    .filter()
    .sort()
    .paginate()
    .fields();

  const meta = await postQuery.countTotal();
  const result = await postQuery.modelQuery;

  return {
    meta,
    result,
  };
};

const findMySelectionPostOption = async ({
  communityPostId,
  authorId,
  authorType,
}: {
  communityPostId: string;
  authorId: string;
  authorType: TAuthorType;
}) => {
  if (authorType === "channelId")
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "channel owner can't select option",
    );

  const postData = await CommunityPostModel.findById(communityPostId);

  if (!postData) throw new AppError(httpStatus.NOT_FOUND, "post not found");

  const { postPollDetails, postPollWithImageDetails, postQuizDetails } =
    postData;

  const { options } =
    postPollDetails || postPollWithImageDetails || postQuizDetails || {};

  if (!options)
    throw new AppError(
      httpStatus.NOT_ACCEPTABLE,
      "selection is only possible in poll or quiz post",
    );

  const selectedOption = postDetailsSelectedIndex({
    doc: postData,
    userId: authorId,
  });

  return { selectedOption };
};

const findCommuityPostById = async ({
  id,
  channelId,
}: {
  id: string;
  channelId: string | undefined;
}) => {
  return await CommunityPostModel.findPostById({
    communityPostId: id,
    channelId,
  });
};

const createPost = async ({ payload }: { payload: ICreateCommunityPost }) => {
  const postData = await CommunityPostModel.create({ ...payload });

  if (postData?.scheduledTime) {
    let delay = new Date(postData.scheduledTime).getTime() - Date.now();

    if (delay < 0) delay = 0;

    await postScheduleQueue.add(
      QueueJobList.COMMUNITY_POST_SCHEDULING_JOB,
      {
        postId: postData._id?.toString(),
        scheduledTime: postData.scheduledTime,
      },
      {
        delay,
        jobId:
          postData._id?.toString() /* jobId to create unique job for each post so if in future we update scheduled time then it automatically inherit new timer and replace previous scheduled job */,
        removeOnComplete: true,
        removeOnFail: true,
      },
    );
  }

  return postData;
};

const updatePost = async ({
  payload,
  id,
}: {
  payload: Partial<ICreateCommunityPost>;
  id: string;
}) => {
  const postData = await CommunityPostModel.findByIdAndUpdate(
    id,
    { ...payload },
    { new: true },
  );

  if (postData?.scheduledTime) {
    let delay = new Date(postData.scheduledTime).getTime() - Date.now();

    if (delay < 0) delay = 0;

    await postScheduleQueue.add(
      QueueJobList.BLOG_POST_SCHEDULING_JOB,
      {
        postId: postData._id?.toString(),
        scheduledTime: postData.scheduledTime,
      },
      {
        delay,
        jobId:
          postData._id?.toString() /* jobId to create unique job for each post so if in future we update scheduled time then it automatically inherit new timer and replace previous scheduled job */,
        removeOnComplete: true,
        removeOnFail: true,
      },
    );
  }

  return postData;
};

const deletePost = async ({ id }: { id: string }) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    /* Deleting all comments of post */
    let result = await CommentServices.deleteAllComment({
      postId: id,
      postType: "communityPost",
    });

    /* Deleting all reactions of post */
    (result as unknown) = await PostReactionModel.deleteAllReactionByPostId(
      id,
      "communityPost",
      session,
    );

    (result as unknown) = await CommentModel.findByIdAndDelete(id, {
      session,
    });

    if (!result)
      throw new AppError(
        httpStatus.INTERNAL_SERVER_ERROR,
        "Something went wrong",
      );

    await session.commitTransaction();
    await session.endSession();

    return result;
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw error;
  }
};

const selectPollOrQuizOption = async ({
  communityPostId,
  selectedOptionIndex,
  authorId,
  authorType,
}: {
  communityPostId: string;
  selectedOptionIndex: number;
  authorId: string;
  authorType: TAuthorType;
}) => {
  if (authorType === "channelId")
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "channel owner can't select option",
    );

  const postData = await CommunityPostModel.findById(communityPostId);

  if (!postData) throw new AppError(httpStatus.NOT_FOUND, "post not found");

  const { postPollDetails, postPollWithImageDetails, postQuizDetails } =
    postData;

  const { options } =
    postPollDetails || postPollWithImageDetails || postQuizDetails || {};

  if (!options)
    throw new AppError(
      httpStatus.NOT_ACCEPTABLE,
      "selection is only possible in poll or quiz post",
    );

  if (selectedOptionIndex >= options?.length)
    throw new AppError(
      httpStatus.NOT_ACCEPTABLE,
      "selectioned option is not available",
    );

  const postDetailsFieldName = postQuizDetails
    ? "postQuizDetails"
    : postPollDetails
      ? "postPollDetails"
      : "postPollWithImageDetails";

  const alreadySelectedIndex = postDetailsSelectedIndex({
    doc: postData,
    userId: authorId,
  });

  let updateData;

  /*
   *
   * converting already selected option to unselect
   *
   */
  if (alreadySelectedIndex >= 0) {
    updateData = await CommunityPostModel.findByIdAndUpdate(
      communityPostId,
      {
        $pull: {
          [`${postDetailsFieldName}.options.${alreadySelectedIndex}.participateList`]:
            authorId,
        },
      },
      {
        new: true,
      },
    ).lean();
  }

  /*
   *
   * if selected item is not already selected
   * because if that is already selected then in our previous query we removed it so it will work as toggle
   *
   */
  if (alreadySelectedIndex !== selectedOptionIndex)
    updateData = await CommunityPostModel.findByIdAndUpdate(
      communityPostId,
      {
        $addToSet: {
          [`${postDetailsFieldName}.options.${selectedOptionIndex}.participateList`]:
            authorId,
        },
      },
      {
        new: true,
      },
    ).lean();
  else selectedOptionIndex = -1;

  return { ...updateData, selectedOption: selectedOptionIndex };
};

export const CommunityPostServices = {
  findCommuityPosts,
  findCommuityPostsByChannelId,
  findCommuityPostById,
  findMySelectionPostOption,
  createPost,
  updatePost,
  deletePost,
  selectPollOrQuizOption,
};
