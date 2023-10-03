import express from 'express';
import routes from './routes';
import config from './config';
import logger from 'morgan';

const port = config.APP_PORT;

const app = express();

app.use(logger(config.LOG_LEVEL));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(routes());

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
