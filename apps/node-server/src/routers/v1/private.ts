import express from "express";
import { vapiRouter } from "./routes/vapi";
import {
  authenticateInternalRequest,
  authenticateVapiRequest,
} from "../../middlewares/auth";

const privateRouter = express.Router();

interface ApiRoute {
  path: string;
  router: express.Router;
  middleware?: express.RequestHandler[];
}

const apiRoutes: Record<string, ApiRoute> = {
  vapi: {
    path: "/vapi",
    router: vapiRouter,
    middleware: [authenticateVapiRequest],
  },
};

Object.values(apiRoutes).forEach(({ path, router, middleware = [] }) => {
  privateRouter.use(path, ...middleware, router);
});

export { privateRouter };
