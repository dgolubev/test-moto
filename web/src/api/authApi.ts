const AuthApi = (): {
  login: (userName: string) => Promise<string>,
} => {
  const login = async (userName: string): Promise<string> => {
    const res = await fetch(
      process.env.REACT_APP_API_URL + '/login',
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

  return {
    login,
  };
}

export default AuthApi();

