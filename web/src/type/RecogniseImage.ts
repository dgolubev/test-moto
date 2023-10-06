export enum RecogniseImageState {
  UPLOADED = 1,
  IN_PROCESS = 2,
  DONE = 3,
  ERROR = 13,
}

export type RecogniseImage = {
  key: string;
  name: string;
  mimetype: string;
  tempFilePath: string;
  size: number;
  state: RecogniseImageState;
  faces?: Record<string, any>[],
}
