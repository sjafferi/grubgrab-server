import Jwt from "@platform/auth/jwt";
import Context from "@platform/common/context";
import Error from "@platform/common/errors";
import User from "@platform/data/User";
import { NextFunction, Request, Response } from "express";
import _ from "lodash";

const URL_PREFIX = "";

const authHandler = async (req: any, res: Response, next: NextFunction) => {
  const authHeader = req.get("Authorization");
  if (!authHeader) {
    next(new Error.UnauthorizedAccessError("Missing Authorization header"));
    return;
  }

  let user: any;
  try {
    user = await Jwt.verify(authHeader);
  } catch (e) {
    const err = `Invalid session for provided token. ${e}`;
    next(new Error.UnauthorizedAccessError(err));
    return;
  }

  try {
    const exists = await User.findOne({ id: user.id });
    if (exists) {
      req.context = new Context({ user });
    } else {
      throw new Error.UnauthorizedAccessError(
        "User provided by token does not exist"
      );
    }
    next();
  } catch (e) {
    next(e);
  }
};

const _unlessStartsWith = (paths: any, middleware: any) => (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (_.some(paths, path => req.path.startsWith(path))) {
    return next();
  }
  return middleware(req, res, next);
};

const _whitelistedPrefixes = [
  `${URL_PREFIX}/users/login`,
  `${URL_PREFIX}/users/signup`,
  `${URL_PREFIX}/restaurants/signup`,
  "/sockjs-node",
  "//sockjs-node"
];

export default () => _unlessStartsWith(_whitelistedPrefixes, authHandler);
