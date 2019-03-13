import { PlatformError } from '@platform/common/errors';
import { Request, Response } from 'express';

const errorHandler = (err: PlatformError, req: Request, res: Response, ) => {
  const code = err.statusCode || 500;
  const message = err.message;
  return res.status(code).json(message);
};

export default () => errorHandler;