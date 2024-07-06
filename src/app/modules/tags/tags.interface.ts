import { ClientSession, Model } from "mongoose";

export interface ITag {
  _id: string;
}

export interface ICreateOptions {
  session?: ClientSession;
}

export interface ITagModel extends Model<ITag> {
  isTagExist(tag: string): Promise<boolean>;
  addTags(tags: Array<string>, session: ClientSession): Promise<unknown>;
  searchTags(tag: string): Promise<Array<ITag>>;
}
