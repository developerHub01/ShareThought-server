import httpStatus from "http-status";
import { CommunityPostModel } from "./model";
import mongoose from "mongoose";
import communityPostSchema from "./model.schema";
import AppError from "../../../errors/AppError";
import errorHandler from "../../../errors/errorHandler";
import { ICreateCommunityPost } from "../community.post.interface";
import { CommentModel } from "../../comment/model/model";
import { PostReactionModel } from "../../post.reaction/model/model";
// const ObjectId = mongoose.Types.ObjectId;

/* static methods start ============================================= */
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
  channelId: string,
): Promise<unknown> => {
  try {
    const postDetails = await CommunityPostModel.findById(communityPostId);

    if (!postDetails)
      throw new AppError(httpStatus.NOT_FOUND, "post not found");

    const { isPublished } = postDetails;

    if (
      channelId &&
      !isPublished &&
      !(await CommunityPostModel.isMyPost(communityPostId, channelId))
    )
      throw new AppError(httpStatus.NOT_FOUND, "post not found");

    return postDetails;
  } catch (error) {
    return errorHandler(error);
  }
};

communityPostSchema.statics.isPublicPostById = async (
  communityPostId: string,
): Promise<boolean | unknown> => {
  try {
    const { isPublished } =
      (await CommunityPostModel.findById(communityPostId)) || {};
    return Boolean(isPublished);
  } catch (error) {
    return errorHandler(error);
  }
};

communityPostSchema.statics.createPost = async (
  payload: ICreateCommunityPost,
): Promise<unknown> => {
  try {
    return await CommunityPostModel.create({ ...payload });
  } catch (error) {
    return errorHandler(error);
  }
};

communityPostSchema.statics.updatePost = async (
  payload: Partial<ICreateCommunityPost>,
  postId: string,
): Promise<unknown> => {
  try {
    return await CommunityPostModel.findByIdAndUpdate(
      postId,
      { ...payload },
      { new: true },
    );
  } catch (error) {
    return errorHandler(error);
  }
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
    return errorHandler(error);
  }
};


/* 
communityPostSchema.statics.findMySelectedOption = async (
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  communityPostId: string,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  authorId: string,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  authorType: TAuthorType,
): Promise<unknown> => {
  try {
  } catch (error) {
    return errorHandler(error);
  }
};


const postDetailsSelectedIndex = (doc: ICommunityPost, userId: string)=>{
  let postDetails;
  if(doc?.postPollDetails) postDetails = doc.postPollDetails
  else if(doc?.postPollWithImageDetails) postDetails = doc.postPollWithImageDetails
  else if(doc?.postQuizDetails) postDetails = doc.postQuizDetails
  else return null;

   return postDetails?.options?.findIndex((option) => {
    if(doc?.postQuizDetails && doc?.postQuizDetails.answeredUsers)
    if(option.answeredUsers) option['answeredUsers'].includes(new ObjectId(userId))
  })
}


communityPostSchema.statics.selectPollOrQuizOption = async (
  communityPostId: string,
  selectedOptionIndex: number,
  authorId: string,
  authorType: TAuthorType,
): Promise<unknown> => {
  try {
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

    const userListFieldName = postQuizDetails ? "answeredUsers" : "polledUsers";

    const alreadySelectedIndex = options.findIndex((option) =>{
      if(postDetailsFieldName==="postQuizDetails" && option['answeredUsers'])
    }
      option[userListFieldName].includes(new ObjectId(authorId)),
    );

    console.log({ alreadySelectedIndex });

    console.log({ postDetailsFieldName, userListFieldName });
    console.log(
      `${postDetailsFieldName}.options[${selectedOptionIndex}].${userListFieldName}`,
    );

    const data = await CommunityPostModel.findByIdAndUpdate(
      communityPostId,
      {
        $addToSet: {
          [`${postDetailsFieldName}.options[${selectedOptionIndex}].${userListFieldName}`]:
            authorId,
        },
        $pull: {
          [`${postDetailsFieldName}.options[${{
            $ne: selectedOptionIndex,
          }}].${userListFieldName}`]: authorId,
        },
      },
      { new: true },
    );

    console.log(data);

    return data;
  } catch (error) {
    return errorHandler(error);
  }
};
 */