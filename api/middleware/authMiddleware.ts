import {
  NextFunction,
  Request,
  RequestHandler,
  Response,
} from 'express';
import jwt from 'jsonwebtoken';
import * as http2 from 'http2';
import userService, { UserService } from '../service/userService';

export const AuthMiddlewareFactory = (
  userSrv: UserService,
): RequestHandler => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const authToken: string | undefined = req.header(http2.constants.HTTP2_HEADER_AUTHORIZATION);
    try {
      userSrv.verifyAccessToken(authToken);

      return next();

    } catch (err) {
      if (err instanceof jwt.TokenExpiredError) {
        userService.releaseUserName(authToken);
      }

      next(err);
    }
  };
};

export default AuthMiddlewareFactory(
  userService,
);
