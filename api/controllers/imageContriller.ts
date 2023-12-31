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
    next: NextFunction,
  ): Promise<void> => {
    try {
      res.send({
        success: true,
        data: Object.fromEntries(listCache),
      });
    } catch (err) {
      return next(err);
    }
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
          key: fileKey,
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
        data: filesKeys,
      });
    } catch (err) {
      return next(err);
    }
  };

  /**
   * Process image (recognising faces)
   * @route POST /images/:id/process
   */
  const faceRecognizeById = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const imageId = req.params['id'];

    const image = listCache.get(imageId);
    if (!image) {
      return next(new Error('image not found'));
    }

    image.state = RecogniseImageState.IN_PROCESS;

    try {
      const frResult = await faceRecognitionSrv.recognise(image);

      image.state = RecogniseImageState.DONE;
      image.faces = frResult;

    } catch (err) {
      console.log(err);

      image.state = RecogniseImageState.ERROR;
    }

    res.send({
      success: image.state !== RecogniseImageState.ERROR,
      data: image,
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
