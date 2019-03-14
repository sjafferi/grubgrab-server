import RestaurantController from "controllers/restaurants.controller";
import express from "express";

const router = express.Router();

router.post("/signup", RestaurantController.create);
router.get("/all", RestaurantController.all);
router.get("/:id", RestaurantController.get);

router.post("/add-food/:restaurantId", RestaurantController.createFoodItems);

export default router;
