import { FaceDetection } from 'face-api.js/build/commonjs/classes/FaceDetection';

enum RecogniseImageState {
  UPLOADED = 1,
  IN_PROCESS = 2,
  DONE = 3,
  ERROR = 13,
}

type RecogniseImage = {
  key: string;
  name: string;
  mimetype: string;
  tempFilePath: string;
  size: number;
  state: RecogniseImageState;
  faces: FaceDetection[],
}

export {
  RecogniseImageState,
  RecogniseImage,
}
