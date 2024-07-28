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
}

export interface ICreateCommunity {
  text: string;
  isPublished?: boolean;
  scheduledTime?: Date;
  postType?: TCommunityPostType;
  postImageDetails?: ICommunityPostImageType;
  postSharedPostDetails?: ICommunitySharedPostType;
  postPollDetails?: ICommunityPostPollType;
  postPollWithImageDetails?: ICommunityPostPollWithImageType;
  postQuizDetails?: ICommunityPostQuizType;
}

export interface ICommunityModel extends Model<ICommunity> {
  isMyPost(communityPostId: string, channelId: string): Promise<boolean>;
  findPostById(communityPostId: string, channelId: string): Promise<unknown>;
  isPublicPostById(communityPostId: string): Promise<boolean | unknown>;
  deletePost(communityPostId: string): Promise<unknown>;
  createPost(payload: ICreateCommunity): Promise<unknown>; 
  updatePost(payload: Partial<ICreateCommunity>): Promise<unknown>; 
}
