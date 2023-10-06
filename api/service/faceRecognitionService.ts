import path from 'path';
import config, { Config } from '../config';
import * as faceapi from 'face-api.js';
import canvas from 'canvas';
import { FaceDetection } from 'face-api.js/build/commonjs/classes/FaceDetection';
import * as fs from 'fs';
import { RecogniseImage } from '../type/RecogniseImage';

export interface FaceRecognitionService {
  recognise: (image: RecogniseImage) => Promise<FaceDetection[]>,
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

  const recognise = async (image: RecogniseImage): Promise<FaceDetection[]> => {
    const img = await canvas.loadImage(image.tempFilePath);

    const faceDetectionNet = faceapi.nets.ssdMobilenetv1;
    await faceDetectionNet.loadFromDisk(path.resolve(__dirname, '../public/faceModels'));

    const faceDetectionOptions = new faceapi.SsdMobilenetv1Options({
      minConfidence: config.FR_CONFIDENCE,
    });

    // @ts-ignore
    const detections: DetectAllFacesTask = await faceapi.detectAllFaces(img, faceDetectionOptions);

    //  for testing purposes
    // @ts-ignore
    const out = faceapi.createCanvasFromMedia(img) as any;
    // @ts-ignore
    faceapi.draw.drawDetections(out, detections);

    const baseDir = path.resolve(__dirname, '../public');
    fs.writeFileSync(path.resolve(baseDir, '_fr_'+ image.name +'.jpg'), out.toBuffer('image/jpeg'));

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
