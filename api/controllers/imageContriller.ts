import {
  NextFunction,
  Request,
  RequestHandler,
  Response,
} from 'express';
import { UploadedFile } from 'express-fileupload';
import { v4 as uuidv4 } from 'uuid';
import faceRecognitionService, { FaceRecognitionService } from '../service/faceRecognitionService';
import {
  RecogniseImage,
  RecogniseImageState,
} from '../type/RecogniseImage';

export interface ImageController {
  list: RequestHandler;
  upload: RequestHandler;
  faceRecognizeById: RequestHandler;
}

const ImageControllerFactory = (
  listCache: Map<string, RecogniseImage>,
  faceRecognitionSrv: FaceRecognitionService,
): ImageController => {
  /**
   * Get list of images
   * @route GET /images
   */
  const list = async (
    req: Request,
    res: Response,
    _next: NextFunction,
  ): Promise<void> => {
    res.send(Object.fromEntries(listCache));
  }

  /**
   * Upload image
   * @route POST /login
   */
  const upload = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const files: UploadedFile[] = Array.isArray(req.files?.image)
        ? req.files?.image ?? []
        : [req.files?.image as UploadedFile];

      if (files.length === 0) {
        throw new Error('file(s) not found');
      }

      //  add to list and return keys for uploaded images
      const filesKeys: string[] = files.map((file: UploadedFile) => {
        const fileKey: string = uuidv4();

        listCache.set(fileKey, {
          name: file.name,
          mimetype: file.mimetype,
          tempFilePath: file.tempFilePath,
          size: file.size,
          state: RecogniseImageState.UPLOADED,
        } as RecogniseImage);

        return fileKey;
      })

      res.send({
        success: true,
        message: 'uploaded',
        filesKeys,
      });
    } catch (err) {
      return next(err);
    }
  };

  /**
   * Process image (recognising faces)
   * @route POST /images/:id/process
   */
  const faceRecognizeById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const imageId = req.params['id'];

    const image = listCache.get(imageId);
    if (!image) {
      return next(new Error('image not found'));
    }

    image.state = RecogniseImageState.IN_PROCESS;

    const imagePath = image.tempFilePath;

    try {
      const frResult = await faceRecognitionSrv.recognise(imagePath);

      image.state = RecogniseImageState.DONE;
      image.faces = frResult;

    } catch (err) {
      image.state = RecogniseImageState.ERROR;

      return next(err);
    }

    res.send({
      success: true,
      message: 'done',
    });
  };

  return {
    list,
    upload,
    faceRecognizeById,
  };
};

export default ImageControllerFactory(
  new Map<string, RecogniseImage>(),
  faceRecognitionService,
);
