import express from 'express';
import routes from './routes';
import config from './config';
import logger from 'morgan';
import cors from 'cors';
import configureFileUpload from './configurator/configureFileUpload';
import errorHandler from './middleware/errorHandler';

const port = config.APP_PORT;

const app = express();

configureFileUpload(app);
app.use(cors());

app.use(logger(config.LOG_LEVEL));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(routes());

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
