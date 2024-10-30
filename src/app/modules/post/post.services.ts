import { ICreatePost } from "./post.interface";
import QueryBuilder from "../../builder/QueryBuilder";
import { PostConstant } from "./post.constant";
import { PostModel } from "./model/model";
import { TagModel } from "../tags/model/model";
import { ITag } from "../tags/tags.interface";
import { postScheduleQueue } from "../../queues/email/queue";
import { QueueJobList } from "../../queues";
import mongoose from "mongoose";
import { CommentServices } from "../comment/comment.services";
import { PostReactionModel } from "../post.reaction/model/model";
import { CategoryModel } from "../category/model/model";
import { ReadLaterModel } from "../read.later/model/model";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";

interface IFindPostByIdQuery {
  _id: string;
  isPublished?: boolean;
}

const findPost = async ({ query }: { query: Record<string, unknown> }) => {
  const postQuery = new QueryBuilder(
    PostModel.find({
      isPublished: true,
    }).populate({
      path: "channelId",
      select: "channelName channelAvatar",
    }),
    query,
  )
    .search(PostConstant.POST_SEARCHABLE_FIELD)
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

/****
 *
 * If any post is panding and I am the author of the channel then only I can see and hide from others
 * If any post is published then anyone can read post
 *
 */
const findPostByChannelId = async ({
  query,
  id,
  channelId,
}: {
  query: Record<string, unknown>;
  id: string;
  channelId: string;
}) => {
  const postQuery = new QueryBuilder(
    PostModel.find({
      channelId: id,
      ...(id === channelId ? {} : { isPublished: true }),
    }).populate({
      path: "channelId",
      select: "channelName channelAvatar",
    }),
    query,
  )
    .search(PostConstant.POST_SEARCHABLE_FIELD)
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

/****
 *
 * If post is panding and I am the author then only I can see and hide from others
 * If post is published then anyone can read post
 *
 */
const findPostByPostId = async ({
  postId,
  channelId,
}: {
  postId: string;
  channelId?: string;
}) => {
  const query: IFindPostByIdQuery = { _id: postId };

  if (channelId) {
    const isMyPost = await PostModel.isMyPost(postId, channelId);

    if (!isMyPost) query["isPublished"] = true;
  }

  return await PostModel.findOne(query).populate({
    path: "channelId",
    select: "channelName channelAvatar",
  });
};

const createPost = async ({ payload }: { payload: ICreatePost }) => {
  let { tags } = payload;

  /* to insure that if post is scheduled then it will be in unpublished state */
  if (payload.scheduledTime) payload.isPublished = false;

  if (tags) {
    (tags as unknown as Array<ITag>) = tags.map((tag: string) => ({
      _id: tag,
    }));

    await TagModel.insertMany(tags, {
      ordered: false,
    });
    /* 
      {ordered:false} because if any of the tag exist in tag collection then ingnore it instead of stoping the process 
    */
  }

  tags = payload.tags;

  const postData = await PostModel.create({
    ...payload,
  });

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

const updatePost = async ({
  payload,
  postId,
}: {
  payload: Partial<ICreatePost>;
  postId: string;
}) => {
  const { tags } = payload;

  /* to insure that if post is scheduled then it will be in unpublished state */
  if (payload.scheduledTime) payload.isPublished = false;

  if (tags) {
    (tags as unknown as Array<ITag>) = tags.map((tag: string) => ({
      _id: tag,
    }));

    await TagModel.insertMany(tags, {
      ordered: false,
    });
    /* 
      {ordered:false} because if any of the tag exist in tag collection then ingnore it instead of stoping the process 
    */
  }

  const postData = await PostModel.findByIdAndUpdate(
    postId,
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

const deletePost = async ({ postId }: { postId: string }) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    /* Deleting all comments of post */
    let result = await CommentServices.deleteAllComment({
      postId,
      postType: "blogPost",
    });

    /* Deleting all reactions of post */
    (result as unknown) = await PostReactionModel.deleteAllReactionByPostId(
      postId,
      "blogPost",
      session,
    );

    /* removing post from all category postList */
    (result as unknown) =
      await CategoryModel.removeSpecificPostFromAllCategoryList(
        postId,
        session,
      );

    /* Deleting all that post from all read later list */
    (result as unknown) =
      await ReadLaterModel.removeFromReadLaterListWhenPostIsDeleting(
        postId,
        session,
      );

    (result as unknown) = await PostModel.findByIdAndDelete(postId, {
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

export const PostServices = {
  findPost,
  findPostByChannelId,
  findPostByPostId,
  createPost,
  updatePost,
  deletePost,
};
