import { Router } from 'express';

import homeController from '../controllers/homeController';
import userController from '../controllers/userController';
import imageController from '../controllers/imageContriller';
import authenticationMiddleware from '../middleware/authMiddleware';

export class Routes {
  static readonly HOME: string = '/';
  static readonly LOGIN: string = '/login';
  static readonly IMAGES_UPLOAD: string = '/images/upload';
  static readonly IMAGES_LIST: string = '/images';
  static readonly IMAGES_ID: string = '/images/:id';
  static readonly IMAGES_ID_PROCESS: string = '/images/:id/process';
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
      homeController.index,
    );

  router
    .route(Routes.IMAGES_LIST)
    .get(
      // authenticationMiddleware,
      imageController.list,
    );

  router
    .route(Routes.IMAGES_ID_PROCESS)
    .post(
      // authenticationMiddleware,
      imageController.faceRecognizeById,
    );

  router
    .route(Routes.IMAGES_UPLOAD)
    .post(
      // authenticationMiddleware,
      imageController.upload,
    );

  return router;
};

export default routes;
