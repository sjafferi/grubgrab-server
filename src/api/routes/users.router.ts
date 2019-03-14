import UserController from "controllers/users.controller";
import express from "express";

const router = express.Router();

router.post("/signup", UserController.create);
router.post("/login", UserController.login);
router.get("/:id", UserController.get);

export default router;
