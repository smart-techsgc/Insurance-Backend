import { Router } from "express";
import { Permissions } from "../middlewares/authorization";
import { PositionService } from "../services/positionService";
const permission = new Permissions();

export const positionRouter = Router();

const positionService = new PositionService();

positionRouter.post(
  "/create",
  [permission.protect],
  positionService.createPosition
);
positionRouter.put(
  "/update",
  [permission.protect],
  positionService.updatePosition
);
positionRouter.delete(
  "/delete",
  [permission.protect],
  positionService.deleteposition
);
positionRouter.put(
  "/assign-user",
  [permission.protect],
  positionService.assignpositionToUser
);
positionRouter.get(
  "/list",
  [permission.protect],
  positionService.listAllPosition
);
positionRouter.get("/get", [permission.protect], positionService.getPosition);
