import QueryBuilder from "../../builder/QueryBuilder";
import errorHandler from "../../errors/errorHandler";
import { ChannelConstant } from "./channel.constant";
import { IChannel, ICreateChannel } from "./channel.interface";
import { ChannelModel } from "./model/model";

const singleChannel = async (id: string, author: boolean) => {
  try {
    if (author)
      return await ChannelModel.findById(id).populate({
        path: "authorId",
        select: "fullName avatar",
      });
    return await ChannelModel.findById(id);
  } catch (error) {
    errorHandler(error);
  }
};

// get all channel or filter and search channel
const findChannel = async (query: Record<string, unknown>) => {
  try {
    const chennelQuery = new QueryBuilder(
      ChannelModel.find({}).populate({
        path: "authorId",
        select: "fullName avatar",
      }),
      query,
    )
      .search(ChannelConstant.CHANNEL_SEARCHABLE_FIELD)
      .filter()
      .sort()
      .paginate()
      .fields();

    const meta = await chennelQuery.countTotal();
    const result = await chennelQuery.modelQuery;

    return {
      meta,
      result,
    };
  } catch (error) {
    errorHandler(error);
  }
};
const getChannelOfMine = async (
  query: Record<string, unknown>,
  authorId: string,
) => {
  try {
    const chennelQuery = new QueryBuilder(
      ChannelModel.find({
        authorId,
      }),
      query,
    )
      .search(ChannelConstant.CHANNEL_SEARCHABLE_FIELD)
      .filter()
      .sort()
      .paginate()
      .fields();

    const meta = await chennelQuery.countTotal();
    const result = await chennelQuery.modelQuery;

    return {
      meta,
      result,
    };
  } catch (error) {
    errorHandler(error);
  }
};

const createChannel = async (payload: ICreateChannel) => {
  try {
    return await ChannelModel.create({
      ...payload,
    });
  } catch (error) {
    errorHandler(error);
  }
};

const updateChannel = async (id: string, payload: Partial<IChannel>) => {
  try {
    return await ChannelModel.findByIdAndUpdate(
      id,
      {
        ...payload,
      },
      { new: true },
    );
  } catch (error) {
    errorHandler(error);
  }
};

const deleteChannel = async (id: string) => {
  try {
    return await ChannelModel.findByIdAndDelete(id);
  } catch (error) {
    errorHandler(error);
  }
};

export const ChannelServices = {
  findChannel,
  singleChannel,
  getChannelOfMine,
  createChannel,
  updateChannel,
  deleteChannel,
};
