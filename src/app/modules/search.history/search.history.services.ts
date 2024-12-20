import QueryBuilder from "../../builder/QueryBuilder";
import { SearchHistoryModel } from "./model/model";
import { SearchHistoryConstant } from "./search.history.constant";

const findSearchHistory = async ({
  query,
}: {
  query: Record<string, unknown>;
}) => {
  const searchHistoryQuery = new QueryBuilder(SearchHistoryModel.find(), query)
    .search(SearchHistoryConstant.SEARCH_HISTORY_SEARCHABLE_FIELD)
    .filter()
    .sort()
    .paginate()
    .fields();

  const meta = await searchHistoryQuery.countTotal();
  const result = await searchHistoryQuery.modelQuery;

  return {
    meta,
    result,
  };
};

const addToSearchList = async ({
  searchTerm,
  userId,
}: {
  searchTerm: string;
  userId: string;
}) => {
  return await SearchHistoryModel.findOneAndUpdate(
    { searchTerm },
    {
      searchTerm,
      $addToSet: {
        ...(userId && { searchUserIdList: userId }),
      },
    },
    { upsert: true, new: true },
  );
};

export const SearchHistoryServices = {
  findSearchHistory,
  addToSearchList,
};
