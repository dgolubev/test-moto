import * as core from 'express-serve-static-core';
import fileUpload, { Options } from 'express-fileupload';
import * as os from 'os';

export default (app: core.Express): void => {
  const fileUploadOpts: Options = {
    useTempFiles: true,
    tempFileDir: os.tmpdir(),
    preserveExtension: true,
  };

  app.use(fileUpload(fileUploadOpts));
};
