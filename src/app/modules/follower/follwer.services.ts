import QueryBuilder from "../../builder/QueryBuilder";
import { IUser } from "../user/user.interface";
import {
  IFollowerListFollower,
  ISocketGetFollowersQuery,
} from "./follower.interface";
import { FollowerUtils } from "./follower.utils";
import { FollowerModel } from "./model/model";

const getChannelFollowing = async (
  query: Record<string, unknown>,
  userId: string,
) => {
  const followerQuery = new QueryBuilder(
    FollowerModel.find({
      userId,
    }).populate({
      path: "channelId",
      select: "channelName channelAvatar",
    }),
    query,
  )
    .filter()
    .sort()
    .paginate()
    .fields();

  const meta = await followerQuery.countTotal();
  const result = await followerQuery.modelQuery;

  return {
    meta,
    result,
  };
};

const getChannelFollowers = async (
  query: Record<string, unknown>,
  channelId: string,
) => {
  const followerQuery = new QueryBuilder(
    FollowerModel.find({
      channelId,
    }).populate({
      path: "userId",
      select: "fullName avatar",
    }),
    query,
  )
    .filter()
    .sort()
    .paginate()
    .fields();

  const meta = await followerQuery.countTotal();
  const result = await followerQuery.modelQuery;

  return {
    meta,
    result,
  };
};

const getChannelFollowersCount = async (channelId: string) => {
  return await FollowerModel.getChannelFollowersCount(channelId);
};

const handleChannelFollowToggle = async (channelId: string, userId: string) => {
  return await FollowerModel.followToggle(channelId, userId);
};

/* socket services start ============== */
const socketGetFollowers = async (query: ISocketGetFollowersQuery) => {
  const { channelId } = query;

  query.page = query.page || 1;
  query.limit = query.limit || 10;
  query.timePeriod = query.timePeriod || "lifetime";
  query.dateOrder = query.dateOrder || "desc";

  query.skip = (query.page - 1) * query.limit;

  const timePeriodStartTime = FollowerUtils.getDateFromTimePeriod(
    query.timePeriod,
  );
  const dateFilter = timePeriodStartTime
    ? {
        $gte: timePeriodStartTime,
      }
    : {};

  const followersDocumentList = await FollowerModel.find({
    channelId,
    ...dateFilter,
  })
    .sort({
      createdAt: query.dateOrder === "asc" ? 1 : -1,
    })
    .skip(query.skip)
    .limit(query.limit)
    .populate({
      path: "userId",
      select: "fullName avatar userName",
    })
    .select("-createdAt -channelId -_id")
    .lean();

  const followersList: Array<IFollowerListFollower> = followersDocumentList.map(
    (follower) => ({
      id: follower?.userId?._id?.toString(),
      avatar: (follower?.userId as unknown as IUser)?.avatar,
      userName: (follower?.userId as unknown as IUser)?.userName,
      fullName: (follower?.userId as unknown as IUser)?.fullName,
      followedAt: (follower as unknown as { updatedAt: Date })?.updatedAt,
    }),
  );
  return followersList;
};

export const FollowerServices = {
  getChannelFollowing,
  getChannelFollowers,
  getChannelFollowersCount,
  handleChannelFollowToggle,
  socketGetFollowers,
};
