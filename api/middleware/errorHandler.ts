import {
  Request,
  Response,
  NextFunction,
} from 'express';
import logger from 'morgan';

const errorHandlerFactory= (
 logger: any,
) => {
  return (
    error: Error,
    _req: Request,
    res: Response,
    _next: NextFunction,
  ): void => {
    logger(`Errorhandler [${error}]`);

    res.status(500).send({
      success: false,
      message: error.message,
      stack: error,
    });
  };
}

export default errorHandlerFactory(
  logger,
);
