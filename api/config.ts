type Config = {
  APP_PORT: number;
  LOG_LEVEL: string;
  JWT_SECRET: string;
  JWT_EXPIRE_IN: string;
};

const config: Config = {
  LOG_LEVEL: process.env.LOG_LEVEL!,
  APP_PORT: Number(process.env.APP_PORT!),
  JWT_SECRET: process.env.JWT_SECRET!,
  JWT_EXPIRE_IN: process.env.JWT_EXPIRE_IN ?? '1m',
};

export default config;
export {
  Config,
};
