import express from "express";

import RestaurantRouter from './restaurants.router';
import UserRouter from "./users.router";

const router = express.Router();

router.all("/", (_, res) => {
  res.json({
    name: "GrubGrab API",
    version: "1.0.0"
  });
});

router.use("/users", UserRouter);
router.use("/restaurants", RestaurantRouter);

export default router;
