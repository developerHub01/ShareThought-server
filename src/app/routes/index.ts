import express, { Router } from "express";
import { ChannelRoutes } from "../modules/channel/channel.route";

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
];

moduleRoutes.forEach(({ path, route }) => router.use(path, route));

export default router;
