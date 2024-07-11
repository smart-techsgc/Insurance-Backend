import { Router } from "express";
import { UserService } from "../services/userService";
import { Permissions } from "../middlewares/authorization";
import multer from "multer";
import uploadFile from "../utils/upload";
const permission = new Permissions();

export const usersRouter = Router();

const userService = new UserService();
const upload = multer({ dest: "uploads/" });

usersRouter.post("/create-user", userService.createUser);
usersRouter.put("/update-user", userService.updateUser);
usersRouter.post("/archive-user", userService.deleteUser);
usersRouter.put("/change-status", userService.toggleUserStatus);
usersRouter.post("/login", userService.loginUser);
usersRouter.post("/verify-otp", userService.verifyOTP);
usersRouter.post("/verify-mfa", userService.verifyMFA);
usersRouter.get("/get-user", [permission.protect], userService.getUser);
usersRouter.get("/list-users", [permission.protect], userService.listUsers);
usersRouter.post(
  "/upload-photo",
  upload.single("file"),
  userService.uploadProfile
);
