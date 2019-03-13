// tslint:disable ordered-imports
import Errors from "@platform/common/errors";
import joi from "@platform/common/joi";
import User from "@platform/data/User";
import Restaurant, { RestaurantSchema } from "@platform/data/Restaurant";
import FoodItem, { FoodItemsSchema } from "@platform/data/FoodItem";
import { NextFunction, Request, Response } from "express";

export default {
  create: async (req: Request, res: Response, next: NextFunction) => {
    const { error } = joi.validate(req.body, RestaurantSchema);
    if (error) {
      return next(
        new Errors.ValidationError("create restaurant", error.details[0].message)
      );
    }

    let response, token;
    try {
      response = await Restaurant.create(req.body);
      token = await User.generateToken(response.owner);
    } catch (e) {
      return next(e);
    }

    res.status(201).send({ ...response, token });
  },

  createFoodItems: async (req: Request, res: Response, next: NextFunction) => {
    const { error } = joi.validate(req.body, FoodItemsSchema);
    if (error) {
      return next(
        new Errors.ValidationError("create food items", error.details[0].message)
      );
    }

    if (!req.params.restaurantId) {
      return next(new Errors.MissingParameterError("restaurant id"));
    }

    let response;
    try {
      response = await FoodItem.createMany(req.params.restaurantId, req.body);
    } catch (e) {
      return next(e);
    }

    res.status(201).send(response);
  },

  get: async (req: Request, res: Response, next: NextFunction) => {
    if (!req.params.id) {
      return next(new Errors.MissingParameterError("id"));
    }

    let response;
    try {
      response = await Restaurant.findOne({ id: req.params.id });
    } catch (e) {
      return next(e);
    }

    res.status(200).send(response);
  },

  all: async (req: Request, res: Response, next: NextFunction) => {
    let response;
    try {
      response = await Restaurant.findAll();
    } catch (e) {
      return next(e);
    }

    res.status(200).send(response);
  }
};
