import express, { Router } from "express";
import { ChannelRoutes } from "../modules/channel/channel.route";
import { AuthRoutes } from "../modules/auth/auth.route";
import { UserRoutes } from "../modules/user/user.route";
import { FollowerRoutes } from "../modules/follower/follower.route";

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
];

moduleRoutes.forEach(({ path, route }) => router.use(path, route));

export default router;
