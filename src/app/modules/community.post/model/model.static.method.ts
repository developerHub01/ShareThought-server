import httpStatus from "http-status";
import { CommunityPostModel } from "./model";
import mongoose from "mongoose";
import communityPostSchema from "./model.schema";
import AppError from "../../../errors/AppError";
import {
  ICommunityPost,
  ICommunityPostPollOption,
  ICommunityPostQuizOption,
  ICreateCommunityPost,
} from "../community.post.interface";
import { CommentModel } from "../../comment/model/model";
import { PostReactionModel } from "../../post.reaction/model/model";
import { TAuthorType } from "../../../interface/interface";
const ObjectId = mongoose.Types.ObjectId;

/* static methods start ============================================= */
communityPostSchema.statics.isPostOfMyAnyChannel = async (
  userId: string,
  postId: string,
): Promise<boolean> => {
  const postData = await CommunityPostModel.findById(
    postId,
    "channelId",
  ).populate({
    path: "channelId",
    select: "authorId -_id",
  });

  if (!postData || !postData?.channelId) return false;

  const {
    channelId: { authorId },
  } = postData as unknown as { channelId: { authorId: string } };

  return userId === authorId?.toString();
};

communityPostSchema.statics.isMyPost = async (
  communityPostId: string,
  channelId: string,
): Promise<boolean> => {
  const { channelId: postChannelId } =
    (await CommunityPostModel.findById(communityPostId).select(
      "channelId -_id",
    )) || {};

  if (!postChannelId)
    throw new AppError(httpStatus.NOT_FOUND, "Post not found");

  return channelId === postChannelId?.toString();
};

communityPostSchema.statics.findPostById = async (
  communityPostId: string,
  channelId: string | undefined,
): Promise<unknown> => {
  const postData = await CommunityPostModel.findById(communityPostId);

  if (!postData) throw new AppError(httpStatus.NOT_FOUND, "post not found");

  const { isPublished } = postData;

  if (
    channelId &&
    !isPublished &&
    !(await CommunityPostModel.isMyPost(communityPostId, channelId))
  )
    throw new AppError(httpStatus.NOT_FOUND, "post not found");

  return postData;
};

communityPostSchema.statics.isPublicPostById = async (
  communityPostId: string,
): Promise<boolean | unknown> => {
  const { isPublished } =
    (await CommunityPostModel.findById(communityPostId)) || {};
  return Boolean(isPublished);
};

communityPostSchema.statics.createPost = async (
  payload: ICreateCommunityPost,
): Promise<unknown> => {
  return await CommunityPostModel.create({ ...payload });
};

communityPostSchema.statics.updatePost = async (
  payload: Partial<ICreateCommunityPost>,
  postId: string,
): Promise<unknown> => {
  return await CommunityPostModel.findByIdAndUpdate(
    postId,
    { ...payload },
    { new: true },
  );
};

communityPostSchema.statics.deletePost = async (
  communityPostId: string,
): Promise<unknown> => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    /* Deleting all comments of post */
    let result = await CommentModel.deleteAllCommentByPostId(
      communityPostId,
      "communityPost",
    );

    /* Deleting all reactions of post */
    (result as unknown) = await PostReactionModel.deleteAllReactionByPostId(
      communityPostId,
      "communityPost",
      session,
    );

    (result as unknown) = await CommentModel.findByIdAndDelete(
      communityPostId,
      {
        session,
      },
    );

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

/*
 *
 *  to find which index of option is selected from all options
 *
 */
const postDetailsSelectedIndex = (doc: ICommunityPost, userId: string) => {
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

/**
 *
 * return the selected option index.
 *
 * format:
 * {
 *  selectedOption: number
 * }
 *
 * ***/
communityPostSchema.statics.findMySelectedOption = async (
  communityPostId: string,
  authorId: string,
  authorType: TAuthorType,
): Promise<unknown> => {
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

  const selectedOption = postDetailsSelectedIndex(postData, authorId);

  return { selectedOption };
};

communityPostSchema.statics.selectPollOrQuizOption = async (
  communityPostId: string,
  selectedOptionIndex: number,
  authorId: string,
  authorType: TAuthorType,
): Promise<unknown> => {
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

  const alreadySelectedIndex = postDetailsSelectedIndex(postData, authorId);

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
