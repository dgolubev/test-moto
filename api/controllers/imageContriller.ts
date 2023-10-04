import {
  NextFunction,
  Request,
  RequestHandler,
  Response,
} from 'express';
import { UploadedFile } from 'express-fileupload';
import { v4 as uuidv4 } from 'uuid';
import {
  RecogniseImage,
  RecogniseImageState,
} from '../type/RecogniseImage';

export interface ImageController {
  upload: RequestHandler;
}

const ImageControllerFactory = (
  listCache: Map<string, RecogniseImage>,
): ImageController => {
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

  return {
    upload,
  };
};

export default ImageControllerFactory(
  new Map<string, RecogniseImage>(),
);
