import { Router } from "express";
import { LandingPage } from "../services/landingService";

export const landingRouter = Router();

const landingService = new LandingPage();

landingRouter.get("/", landingService.getPage);
