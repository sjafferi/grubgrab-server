import { PlatformError } from '@platform/common/errors';
import { NextFunction, Request, Response } from 'express';

const errorHandler = (err: PlatformError, req: Request, res: Response, next: NextFunction) => {
  const code = err.statusCode || 500;
  return res.status(code).json({ error: err });
};

export default errorHandler;