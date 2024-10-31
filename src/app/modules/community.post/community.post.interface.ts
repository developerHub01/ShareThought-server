import { Model, Types } from "mongoose";
import { CommunityPostConstant } from "./community.post.constant";

const communityPostTypeList: Array<string> = Object.keys(
  CommunityPostConstant?.COMMUNITY_POST_TYPES,
);

export type TCommunityPostType = (typeof communityPostTypeList)[number];

/* Image post type ================================ */
export interface ICommunityPostImageType {
  image: string;
}

/* shared post post type ================================ */
export interface ICommunitySharedPostType {
  postId: Types.ObjectId;
}

/* poll post type ================================ */
export interface ICommunityPostPollOption {
  text: string;
  participateList: Array<Types.ObjectId>;
  successRate?: number;
}

export interface ICommunityPostPollType {
  options: Array<ICommunityPostPollOption>;
}

/* poll post type ================================ */
export interface ICommunityPostPollOptionWithImage {
  text: string;
  image: string;
  participateList: Array<Types.ObjectId>;
}

export interface ICommunityPostPollWithImageType {
  options: Array<ICommunityPostPollOptionWithImage>;
}

/* quiz post type ================================ */
export interface ICommunityPostQuizOption {
  text: string;
  isCurrectAnswer: boolean;
  currectAnswerExplaination?: string;
  participateList: Array<Types.ObjectId>;
  successRate?: number;
}

export interface ICommunityPostQuizType {
  options: Array<ICommunityPostQuizOption>;
}

export interface ICommunityPost {
  channelId: Types.ObjectId;
  text: string;
  isPublished: boolean;
  publihedAt?: Date;
  scheduledTime?: Date;
  postType: TCommunityPostType;
  postImageDetails?: ICommunityPostImageType;
  postSharedPostDetails?: ICommunitySharedPostType;
  postPollDetails?: ICommunityPostPollType;
  postPollWithImageDetails?: ICommunityPostPollWithImageType;
  postQuizDetails?: ICommunityPostQuizType;
  totalAnswered?: number;
  totalPolled?: number;
}

export interface ICreateCommunityPost {
  text: string;
  channelId: string;
  isPublished?: boolean;
  scheduledTime?: Date;
  postType?: TCommunityPostType;
  postImageDetails?: ICommunityPostImageType;
  postSharedPostDetails?: ICommunitySharedPostType;
  postPollDetails?: ICommunityPostPollType;
  postPollWithImageDetails?: ICommunityPostPollWithImageType;
  postQuizDetails?: ICommunityPostQuizType;
}

export interface ICommunityPostModel extends Model<ICommunityPost> {
  isPostOfMyAnyChannel({
    userId,
    postId,
  }: {
    userId: string;
    postId: string;
  }): Promise<boolean>;

  isMyPost({
    communityPostId,
    channelId,
  }: {
    communityPostId: string;
    channelId: string;
  }): Promise<boolean>;

  findPostById({
    communityPostId,
    channelId,
  }: {
    communityPostId: string;
    channelId?: string;
  }): Promise<unknown>;

  isPublicPostById({
    communityPostId,
  }: {
    communityPostId: string;
  }): Promise<boolean | unknown>;
}
