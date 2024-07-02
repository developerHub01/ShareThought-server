import express, { Router } from "express";
import { ChannelRoutes } from "../modules/channel/channel.route";
import { AuthRoutes } from "../modules/auth/auth.route";
import { UserRoutes } from "../modules/user/user.route";

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
];

moduleRoutes.forEach(({ path, route }) => router.use(path, route));

export default router;
