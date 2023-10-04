import path from 'path';
import config, { Config } from '../config';
import * as faceapi from 'face-api.js';
import canvas from 'canvas';
import { FaceDetection } from 'face-api.js/build/commonjs/classes/FaceDetection';

export interface FaceRecognitionService {
  recognise: (imagePath: string) => Promise<FaceDetection[]>,
}

export const FaceRecognitionServiceFactory = (
  config: Config,
): FaceRecognitionService => {
  //  magic patch from library manual
  const {
    Canvas,
    Image,
    ImageData,
  } = canvas;
  faceapi.env.monkeyPatch({
    Canvas,
    Image,
    ImageData,
  } as unknown as faceapi.Environment);

  const recognise = async (imagePath: string): Promise<FaceDetection[]> => {
    const img = await canvas.loadImage(imagePath);

    const faceDetectionNet = faceapi.nets.ssdMobilenetv1;
    await faceDetectionNet.loadFromDisk(path.resolve(__dirname, '../public/faceModels'));

    const faceDetectionOptions = new faceapi.SsdMobilenetv1Options({
      minConfidence: config.FR_CONFIDENCE,
    });

    // @ts-ignore
    return await faceapi.detectAllFaces(img, faceDetectionOptions) as FaceDetection[];
  }

  return {
    recognise,
  }
}

export default FaceRecognitionServiceFactory(
  config,
);
