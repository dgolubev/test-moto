import {
  NextFunction,
  Request,
  RequestHandler,
  Response,
} from 'express';
import userService, { UserService } from '../service/userService';

export interface UserController {
  login: RequestHandler;
  isAuth: RequestHandler;
}

const UserControllerFactory = (
  userService: UserService,
): UserController => {
  /**
   * User authentication
   * @route POST /login
   */
  const login = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const userName = req.body.userName;

    if (!userName) {
      return next(new Error('Invalid user name'));
    }

    try {
      const token = userService.createAccessToken(userName);

      res.send({
        success: true,
        token,
      });
    } catch (err) {
      return next(err);
    }
  };

  /**
   * User authentication
   * @route POST /login
   */
  const isAuth = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const token = req.params.token;

    try {
      userService.verifyAccessToken(token);

      res.send({
        success: true,
      });
    } catch (err) {
      return next(err);
    }
  };

  return {
    login,
    isAuth,
  };
};

export default UserControllerFactory(
  userService,
);
