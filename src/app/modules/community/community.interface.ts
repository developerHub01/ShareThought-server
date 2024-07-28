import { Model, Types } from "mongoose";
import { CommunityConstant } from "./community.constant";

const communityPostTypeList: Array<string> = Object.keys(
  CommunityConstant?.COMMUNITY_POST_TYPES,
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
  polledUsers: Array<Types.ObjectId>;
}

export interface ICommunityPostPollType {
  options: Array<ICommunityPostPollOption>;
}

/* poll post type ================================ */
export interface ICommunityPostPollOptionWithImage {
  text: string;
  image: string;
  polledUsers: Array<Types.ObjectId>;
}

export interface ICommunityPostPollWithImageType {
  options: Array<ICommunityPostPollOption>;
}

/* quiz post type ================================ */
export interface ICommunityPostQuizOption {
  text: string;
  isCurrectAnswer: boolean;
  currectAnswerExplaination?: string;
  answeredUsers: Array<Types.ObjectId>;
}

export interface ICommunityPostQuizType {
  options: Array<ICommunityPostQuizOption>;
}

export interface ICommunity {
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
}

export interface ICommunityModel extends Model<ICommunity> {}
