enum RecogniseImageState {
  UPLOADED = 1,
  IN_PROCESS = 2,
  DONE = 3,
}

type RecogniseImage = {
  name: string;
  mimetype: string;
  tempFilePath: string;
  size: number;
  state: RecogniseImageState;
}

export {
  RecogniseImageState,
  RecogniseImage,
}
