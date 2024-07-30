import { Model, Types } from "mongoose";
import { CommunityPostConstant } from "./community.post.constant";
import { TAuthorType } from "../../interface/interface";

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
  options: Array<ICommunityPostPollOptionWithImage>;
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
  isMyPost(communityPostId: string, channelId: string): Promise<boolean>;

  findPostById(communityPostId: string, channelId: string): Promise<unknown>;

  isPublicPostById(communityPostId: string): Promise<boolean | unknown>;

  createPost(payload: ICreateCommunityPost): Promise<unknown>;

  updatePost(
    payload: Partial<ICreateCommunityPost>,
    postId: string,
  ): Promise<unknown>;

  deletePost(communityPostId: string): Promise<unknown>;

  findMySelectedOption(
    communityPostId: string,
    authorId: string,
    authorType: TAuthorType,
  ): Promise<unknown>;

  selectPollOrQuizOption(
    communityPostId: string,
    selectedOptionIndex: number,
    authorId: string,
    authorType: TAuthorType,
  ): Promise<unknown>;
}
