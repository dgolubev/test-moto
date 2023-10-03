import { Router } from 'express';

import homeController from '../controllers/homeController';
import userController from '../controllers/userController';
import authenticationMiddleware from '../middleware/authMiddleware';

export class Routes {
  static readonly HOME: string = '/';
  static readonly LOGIN: string = '/login';
}

const routes = () => {
  const router = Router();

  router
    .route(Routes.LOGIN)
    .post(
      userController.login,
    );

  router
    .route(Routes.HOME)
    .get(
      authenticationMiddleware,
      homeController.index,
    );

  return router;
};

export default routes;
