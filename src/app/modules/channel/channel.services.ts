import QueryBuilder from "../../builder/QueryBuilder";
import errorHandler from "../../errors/errorHandler";
import { ChannelConstant } from "./channel.constant";
import { IChannel, ICreateChannel } from "./channel.interface";
import { ChannelModel } from "./channel.model";

const getChannelById = async (id: string, author: boolean) => {
  try {
    if (author) return await ChannelModel.findById(id).populate("authorId");
    return await ChannelModel.findById(id);
  } catch (error) {
    errorHandler(error);
  }
};

// get all channel or filter and search channel
const getAllChannel = async (query: Record<string, unknown>) => {
  try {
    const chennelQuery = new QueryBuilder(ChannelModel.find({}), query)
      .search(ChannelConstant.channelSearchableField)
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
      .search(ChannelConstant.channelSearchableField)
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
  getAllChannel,
  getChannelById,
  getChannelOfMine,
  createChannel,
  updateChannel,
  deleteChannel,
};
