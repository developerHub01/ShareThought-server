import QueryBuilder from "../../builder/QueryBuilder";
import errorHandler from "../../errors/errorHandler";
import { CommunityConstant } from "./community.constant";
import { ICreateCommunity } from "./community.interface";
import { CommunityModel } from "./community.model";

const findCommuityPosts = async (query: Record<string, unknown>) => {
  try {
    const postQuery = new QueryBuilder(
      CommunityModel.find({
        isPublished: true,
      }).populate({
        path: "channelId",
        select: "channelName channelAvatar",
      }),
      query,
    )
      .search(CommunityConstant.COMMUNITY_POST_SEARCHABLE_FIELD)
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
      CommunityModel.find({
        isPublished: true,
        channelId,
      }).populate({
        path: "channelId",
        select: "channelName channelAvatar",
      }),
      query,
    )
      .search(CommunityConstant.COMMUNITY_POST_SEARCHABLE_FIELD)
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

const findCommuityPostById = async (id: string) => {
  try {
    return CommunityModel.findById(id);
  } catch (error) {
    errorHandler(error);
  }
};

const createPost = async (payload: ICreateCommunity) => {
  try {
    return CommunityModel.createPost(payload);
  } catch (error) {
    errorHandler(error);
  }
};

const updatePost = async (payload: Partial<ICreateCommunity>, id: string) => {
  try {
    return CommunityModel.updatePost(payload, id);
  } catch (error) {
    errorHandler(error);
  }
};

const deletePost = async (id: string) => {
  try {
    return CommunityModel.deletePost(id);
  } catch (error) {
    errorHandler(error);
  }
};

export const CommunityServices = {
  findCommuityPosts,
  findCommuityPostsByChannelId,
  findCommuityPostById,
  createPost,
  updatePost,
  deletePost,
};
