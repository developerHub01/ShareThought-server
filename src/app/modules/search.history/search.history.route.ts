import express from "express";
import { SearchHistoryController } from "./search.history.controller";
import checkAuthStatus from "../../middleware/check.auth.status";

const router = express.Router();

router.get(
  "/",
  /* 
    ?searchTerm=tesla&sort=updatedAt,totalSearch&fields=searchTerm,-_id
  */ checkAuthStatus,
  SearchHistoryController.findSearchHistory,
);

export const SearchHistoryRoutes = router;
