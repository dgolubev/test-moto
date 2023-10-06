import authApi from '../api/authApi';

export interface AuthProvider {
  isAuthenticated: () => Promise<boolean>;
  getUserName: () => string | undefined;
  getToken: () => string | undefined;
  signIn: (userName: string) => Promise<void>;
  signOut: () => void;
}

const authProvider = ((): AuthProvider => {
  let _userName: string | undefined = undefined;
  let _token: string | undefined = undefined;

  const signIn = async (userName: string): Promise<void> => {
    _token = await authApi.login(userName);

    _userName = userName;
  };

  const signOut = (): void => {
    _token = undefined;
    _userName = undefined;
  };

  const isAuthenticated = async (): Promise<boolean> => {
    if (!_token) {
      return false;
    }

    try {
      return authApi.isAuth(_token);
    } catch (err) {
      return false;
    }
  }

  const getUserName = (): string | undefined => {
    return _userName;
  }

  const getToken = (): string | undefined => {
    return _token;
  }

  return {
    signIn,
    signOut,
    isAuthenticated,
    getUserName,
    getToken,
  };
})();

export {
  authProvider,
};
