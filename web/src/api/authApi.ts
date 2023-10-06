const AuthApi = (): {
  login: (userName: string) => Promise<string>,
  isAuth: (token: string) => Promise<boolean>,
} => {
  const apiUrl = process.env.REACT_APP_API_URL;

  const login = async (userName: string): Promise<string> => {
    const res = await fetch(
      apiUrl + '/login',
      {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          userName,
        }),
      } as RequestInit);

    const result = await res.json() as unknown as {
      success: boolean,
      message?: string,
      token?: string,
    };

    if (!result.success) {
      throw new Error(result.message!);
    }

    return result.token!;
  }

  const isAuth = async (token: string): Promise<boolean> => {
    const res = await fetch(apiUrl + '/is-auth/' + token);

    const result = await res.json() as unknown as {
      success: boolean,
    };

    return result.success!;
  }

  return {
    login,
    isAuth,
  };
}

export default AuthApi();

