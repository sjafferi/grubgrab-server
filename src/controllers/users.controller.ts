// tslint:disable ordered-imports
import Errors from "@platform/common/errors";
import joi from "@platform/common/joi";
import User, { UserLoginSchema } from "@platform/data/User";
import Customer, { CustomerSchema } from "@platform/data/Customer";
import { NextFunction, Request, Response } from "express";

export default {
  create: async (req: Request, res: Response, next: NextFunction) => {
    const { error } = joi.validate(req.body, CustomerSchema);
    if (error) {
      return next(
        new Errors.ValidationError("create user", error.details[0].message)
      );
    }

    let response, token;
    try {
      response = await Customer.create(req.body);
      token = await User.generateToken(response);
    } catch (e) {
      return next(e);
    }

    res.status(201).send({ ...response, token });
  },

  get: async (req: Request, res: Response, next: NextFunction) => {
    if (!req.params.id) {
      return next(new Errors.MissingParameterError("id"));
    }

    let response;
    try {
      response = await User.findOne({ id: req.params.id });
    } catch (e) {
      return next(e);
    }

    res.status(200).send(response);
  },

  login: async (req: Request, res: Response, next: NextFunction) => {
    const { error } = joi.validate(req.body, UserLoginSchema);
    if (error) {
      return next(
        new Errors.ValidationError("login user", error.details[0].message)
      );
    }

    let response, token;
    try {
      response = await User.findOne(req.body);
      token = await User.generateToken(response);
    } catch (e) {
      console.log(e);
      next(e);
      return;
    }

    res.status(200).send({ ...response, token });
  }
};
