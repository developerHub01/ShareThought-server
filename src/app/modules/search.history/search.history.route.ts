import express from "express";
import { SearchHistoryController } from "./search.history.controller";

const router = express.Router();

router.get(
  "/",
  /* 
    ?searchTerm=tesla&sort=updatedAt,totalSearch&fields=searchTerm,-_id
  */
  SearchHistoryController.findSearchHistory,
);

export const SearchHistoryRoutes = router;
