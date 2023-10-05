import authApi from '../api/authApi';

interface AuthProvider {
  isAuthenticated: () => boolean;
  getUserName: () => string | undefined;
  getToken: () => string | undefined;
  signIn(userName: string): Promise<void>;
  signOut(): Promise<void>;
}

const authProvider = ((): AuthProvider => {
  let _isAuthenticated: boolean = false;
  let _userName: string | undefined = undefined;
  let _token: string | undefined = undefined;

  const signIn = async (userName: string): Promise<void> => {
    _token = await authApi.login(userName);

    _isAuthenticated = true;
    _userName = userName;
  };

  const signOut = async (): Promise<void> => {
    _isAuthenticated = false;
    _token = undefined;
    _userName = undefined;
  };

  const isAuthenticated = (): boolean => {
    return _isAuthenticated;
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
