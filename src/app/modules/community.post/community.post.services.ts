import QueryBuilder from "../../builder/QueryBuilder";
import { TAuthorType } from "../../interface/interface";
import { CommunityPostConstant } from "./community.post.constant";
import { ICreateCommunityPost } from "./community.post.interface";
import { CommunityPostModel } from "./model/model";

const findCommuityPosts = async (query: Record<string, unknown>) => {
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

const findCommuityPostsByChannelId = async (
  query: Record<string, unknown>,
  channelId: string,
) => {
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

const findMySelectionPostOption = async (
  communityPostId: string,
  authorId: string,
  authorType: TAuthorType,
) => {
  return CommunityPostModel.findMySelectedOption(
    communityPostId,
    authorId,
    authorType,
  );
};

const findCommuityPostById = async (
  id: string,
  channelId: string | undefined,
) => {
  return await CommunityPostModel.findPostById(id, channelId);
};

const createPost = async (payload: ICreateCommunityPost) => {
  return CommunityPostModel.createPost(payload);
};

const updatePost = async (
  payload: Partial<ICreateCommunityPost>,
  id: string,
) => {
  return CommunityPostModel.updatePost(payload, id);
};

const deletePost = async (id: string) => {
  return CommunityPostModel.deletePost(id);
};

const selectPollOrQuizOption = async (
  communityPostId: string,
  selectedOptionIndex: number,
  authorId: string,
  authorType: TAuthorType,
) => {
  return CommunityPostModel.selectPollOrQuizOption(
    communityPostId,
    selectedOptionIndex,
    authorId,
    authorType,
  );
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
