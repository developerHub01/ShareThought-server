import QueryBuilder from "../../builder/QueryBuilder";
import errorHandler from "../../errors/errorHandler";
import { TAuthorType } from "../../interface/interface";
import { CommunityPostConstant } from "./community.post.constant";
import { ICreateCommunityPost } from "./community.post.interface";
import { CommunityPostModel } from "./model/model";

const findCommuityPosts = async (query: Record<string, unknown>) => {
  try {
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
  } catch (error) {
    errorHandler(error);
  }
};

const findCommuityPostsByChannelId = async (
  query: Record<string, unknown>,
  channelId: string,
) => {
  try {
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
  } catch (error) {
    errorHandler(error);
  }
};

const findMySelectionPostOption = async (
  communityPostId: string,
  authorId: string,
  authorType: TAuthorType,
) => {
  try {
    return CommunityPostModel.findMySelectedOption(
      communityPostId,
      authorId,
      authorType,
    );
  } catch (error) {
    errorHandler(error);
  }
};

const findCommuityPostById = async (
  id: string,
  channelId: string | undefined,
) => {
  try {
    return await CommunityPostModel.findPostById(id, channelId);
  } catch (error) {
    errorHandler(error);
  }
};

const createPost = async (payload: ICreateCommunityPost) => {
  try {
    return CommunityPostModel.createPost(payload);
  } catch (error) {
    errorHandler(error);
  }
};

const updatePost = async (
  payload: Partial<ICreateCommunityPost>,
  id: string,
) => {
  try {
    return CommunityPostModel.updatePost(payload, id);
  } catch (error) {
    errorHandler(error);
  }
};

const deletePost = async (id: string) => {
  try {
    return CommunityPostModel.deletePost(id);
  } catch (error) {
    errorHandler(error);
  }
};

const selectPollOrQuizOption = async (
  communityPostId: string,
  selectedOptionIndex: number,
  authorId: string,
  authorType: TAuthorType,
) => {
  try {
    return CommunityPostModel.selectPollOrQuizOption(
      communityPostId,
      selectedOptionIndex,
      authorId,
      authorType,
    );
  } catch (error) {
    errorHandler(error);
  }
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
