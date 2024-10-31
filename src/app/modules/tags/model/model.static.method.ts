import { ClientSession } from "mongoose";
import { TagModel } from "./model";
import tagSchema from "./model.schema";
import { ITag } from "../tags.interface";

tagSchema.statics.isTagExist = async ({
  tag,
}: {
  tag: string;
}): Promise<boolean> => Boolean(await TagModel.findOne({ tagName: tag }));

tagSchema.statics.addTags = async (
  tags: Array<string>,
  session?: ClientSession,
) => {
  // try {
  //   const result = await Promise.allSettled(
  //     tags.map((_id) =>
  //       TagModel.create(
  //         [
  //           {
  //             _id,
  //           },
  //         ],
  //         { session },
  //       ),
  //     ),
  //   );

  //   return result;
  // } catch (error) {
  //   console.log(error?.message);
  // }

  // const result = await Promise.allSettled(
  //   tags.map((tag) =>
  //     TagModel.updateOne(
  //       { _id: tag },
  //       {
  //         $setOnInsert: { _id: tag },
  //       },
  //       {
  //         upsert: true,
  //         session,
  //       },
  //     ),
  //   ),
  // );

  const tagUpserts = tags.map(async (tag) => {
    const isTagExist = await TagModel.findById(tag);

    if (isTagExist) return null;

    TagModel.create(
      [
        {
          _id: tag,
        },
      ],
      { session },
    );

    // return TagModel.updateOne(
    //   { _id: tag },
    //   { $setOnInsert: { _id: tag } },
    //   { upsert: true, session },
    // ).then((result) => ({ tag, result }));
  });

  const result = await Promise.all(tagUpserts);

  return result;
};

tagSchema.statics.searchTags = async ({
  tag,
}: {
  tag: string;
}): Promise<Array<ITag>> => {
  return await TagModel.find({
    tagName: { $regex: tag, $options: "i" },
  });
};
