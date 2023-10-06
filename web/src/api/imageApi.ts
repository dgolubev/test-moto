import { RecogniseImage } from '../type/RecogniseImage';

const ImageApi = (): {
  list: () => Promise<RecogniseImage[]>,
} => {
  const list = async (): Promise<RecogniseImage[]> => {
    const res = await fetch(
      process.env.REACT_APP_API_URL + '/images',
      {
        method: 'GET',
        headers: {
          'content-type': 'application/json',
        },
      } as RequestInit);

    const result = await res.json() as unknown as {
      success: boolean,
      message?: string,
      data?: RecogniseImage[],
    };

    if (!result.success) {
      throw new Error(result.message!);
    }

    return result.data!;
  }

  return {
    list,
  };
}

export default ImageApi();

