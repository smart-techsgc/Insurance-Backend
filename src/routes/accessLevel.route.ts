import { Router } from "express";
import { Permissions } from "../middlewares/authorization";
import { AccessLevelService } from "../services/accessLevelService";
const permission = new Permissions();

export const accessRouter = Router();

const accessService = new AccessLevelService();

accessRouter.post(
  "/create",
  [permission.protect],
  accessService.createAccessLevel
);
accessRouter.put(
  "/update",
  [permission.protect],
  accessService.updateAccessLevel
);
accessRouter.delete(
  "/delete",
  [permission.protect],
  accessService.deleteAccessLevel
);
accessRouter.put(
  "/assign-user",
  [permission.protect],
  accessService.assignAccessLevelToUser
);
accessRouter.get(
  "/list",
  [permission.protect],
  accessService.listAllAccessLevel
);
accessRouter.get("/get", [permission.protect], accessService.getAccessLevel);
