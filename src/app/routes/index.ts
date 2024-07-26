import express, { Router } from "express";
import { ChannelRoutes } from "../modules/channel/channel.route";
import { AuthRoutes } from "../modules/auth/auth.route";
import { UserRoutes } from "../modules/user/user.route";
import { FollowerRoutes } from "../modules/follower/follower.route";
import { PostRoutes } from "../modules/post/post.route";
import { CommentRoutes } from "../modules/comment/comment.route";
import { NotificationRoutes } from "../modules/notification/notification.route";
import { CategoryRoutes } from "../modules/category/category.route";
import { ReadLaterRoutes } from "../modules/read.later/read.later.route";
import { SavedCategoryRoutes } from "../modules/saved.category/saved.category.route";
import { HistoryRoutes } from "../modules/history/history.route";
import { SearchHistoryRoutes } from "../modules/search.history/search.history.route";
import { MediaRoutes } from "../modules/media/media.route";

interface IRouteSchema {
  path: string;
  route: Router;
}

const router = express.Router();

const moduleRoutes: Array<IRouteSchema> = [
  {
    path: "/channel",
    route: ChannelRoutes,
  },
  {
    path: "/auth",
    route: AuthRoutes,
  },
  {
    path: "/user",
    route: UserRoutes,
  },
  {
    path: "/follow",
    route: FollowerRoutes,
  },
  {
    path: "/post",
    route: PostRoutes,
  },
  {
    path: "/comment",
    route: CommentRoutes,
  },
  {
    path: "/category",
    route: CategoryRoutes,
  },
  {
    path: "/read_later",
    route: ReadLaterRoutes,
  },
  {
    path: "/save_category",
    route: SavedCategoryRoutes,
  },
  {
    path: "/history",
    route: HistoryRoutes,
  },
  {
    path: "/search_history",
    route: SearchHistoryRoutes,
  },
  {
    path: "/media",
    route: MediaRoutes,
  },
  {
    path: "/notification",
    route: NotificationRoutes,
  },
];

moduleRoutes.forEach(({ path, route }) => router.use(path, route));

export default router;
