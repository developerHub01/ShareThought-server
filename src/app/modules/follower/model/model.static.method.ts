import httpStatus from "http-status";
import { FollowerModel } from "./model";
import followerSchema from "./model.schema";
import { ChannelModel } from "../../channel/model/model";
import AppError from "../../../errors/AppError";

followerSchema.statics.isFollowing = async (
  channelId: string,
  userId: string,
) => {
  return Boolean(
    await FollowerModel.findOne({
      channelId,
      userId,
    }),
  );
};

followerSchema.statics.getChannelFollowersCount = async (channelId: string) => {
  const channelData = await ChannelModel.findById(channelId);

  if (!channelData)
    throw new AppError(httpStatus.NOT_FOUND, "channel not found");

  const { followerCount: count } = channelData;

  return {
    count,
  };
};

followerSchema.statics.followToggle = async (
  channelId: string,
  userId: string,
) => {
  /* Check if the user is trying to follow their own channel */
  const isMyChannel = await ChannelModel.isChannelMine({
    channelId,
    authorId: userId,
  });

  /* Prevent user from following their own channel */
  if (isMyChannel)
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "You can't follow your own channel",
    );

  /* Start a session for transaction */
  const session = await FollowerModel.startSession();
  session.startTransaction();

  try {
    let result;
    const isFollowing = await FollowerModel.isFollowing(
      channelId,
      userId,
    ); /* Check if already following */

    if (isFollowing) {
      /* If already following, remove the follower document */
      result = await FollowerModel.deleteOne({
        userId,
        channelId,
      }).session(session); /* Make sure to include the session */
    } else {
      /* If not following, create a new follower document */
      result = (
        await FollowerModel.create(
          [
            {
              userId,
              channelId,
            },
          ],
          { session } /*  Include the session in creation as well */,
        )
      )[0];
    }

    /* Update the follower count in the ChannelModel atomically as part of the transaction */
    await ChannelModel.findByIdAndUpdate(
      channelId,
      {
        $inc: {
          followerCount: isFollowing ? -1 : 1,
        } /* Decrement if unfollowing, increment if following */,
      },
      {
        session /* Include session to ensure the update is part of the transaction */,
      },
    );

    /* Commit the transaction if everything goes well */
    await session.commitTransaction();
    session.endSession(); /* Always clean up the session after committing */
    return result;
  } catch (error) {
    /* If an error occurs, abort the transaction and rollback any changes */
    await session.abortTransaction();
    session.endSession(); /* End the session even if there's an error */
    throw error; /* Throw the error to be handled by error middleware */
  }
};
