import {
  NextFunction,
  Request,
  RequestHandler,
  Response,
} from 'express';

export interface HomeController {
  index: RequestHandler;
}

const HomeControllerFactory = (): HomeController => {
  /**
   * @route get /
   */
  const index = async (
    _req: Request,
    res: Response,
    _next: NextFunction
  ): Promise<void> => {
    res.json({
      title: 'Express + TS + Nodemon',
    });
  };

  return {
    index,
  };
};

export default HomeControllerFactory();
