import QueryBuilder from "../../builder/QueryBuilder";
import errorHandler from "../../errors/errorHandler";
import { SearchHistoryConstant } from "./search.history.constant";
import { SearchHistoryModel } from "./search.history.model";

const findSearchHistory = async (query: Record<string, unknown>) => {
  try {
    const searchHistoryQuery = new QueryBuilder(
      SearchHistoryModel.find(),
      query,
    )
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
  } catch (error) {
    return errorHandler(error);
  }
};

export const SearchHistoryServices = {
  findSearchHistory,
};
