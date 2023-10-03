import jwt from 'jsonwebtoken';
import config, { Config } from '../config';

export interface UserService {
  createAccessToken: (userName: string) => string,
  verifyAccessToken: (authToken: string | undefined) => void,
  releaseUserName: (userName: string | undefined) => void,
}

/**
 * User Management service
 * @param config  configuration object
 * @param cache keep already logged users
 * @constructor
 */
export const UserServiceFactory = (
  config: Config,
  cache: Set<string>,
): UserService => {
  /**
   * Create JWT authentication token
   * @param userName user name
   */
  const createAccessToken = (userName: string): string => {
    if (cache.has(userName)) {
      throw new Error('User Already Logged');
    }

    //  add to cache
    cache.add(userName);

    //  create new token
    return jwt.sign(
      {
        userName: userName,
      },
      config.JWT_SECRET,
      {
        expiresIn: config.JWT_EXPIRE_IN,
      },
    );
  }

  /**
   * Verify is authentication token still valid
   * @param authToken authentication token
   */
  const verifyAccessToken = (authToken: string | undefined): void => {
    jwt.verify(authToken ?? '', config.JWT_SECRET);
  }

  /**
   * Remove username from cache
   * @param authToken authentication token
   */
  const releaseUserName = (authToken: string | undefined): void => {
    const decoded = jwt.decode(authToken ?? '', { json: true });

    decoded && decoded.userName && cache.delete(decoded.userName);
  }

  return {
    createAccessToken,
    verifyAccessToken,
    releaseUserName,
  }
}

export default UserServiceFactory(
  config,
  new Set<string>(),
);
