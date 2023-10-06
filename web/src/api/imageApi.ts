import { RecogniseImage } from '../type/RecogniseImage';

const ImageApi = (): {
  getList: () => Promise<Record<string, RecogniseImage>>,
  upload: (formData: FormData) => Promise<any>,
  recognizeFaces: (key: string) => Promise<RecogniseImage>,
} => {
  const apiUrl = process.env.REACT_APP_API_URL;

  /**
   * get list of images
   */
  const getList = async (): Promise<Record<string, RecogniseImage>> => {
    const res = await fetch(
      apiUrl + '/images',
      {
        method: 'GET',
        headers: {
          'content-type': 'application/json',
        },
      } as RequestInit);

    const result = await res.json() as unknown as {
      success: boolean,
      message?: string,
      data?: Record<string, RecogniseImage>,
    };

    if (!result.success) {
      throw new Error(result.message!);
    }

    return result.data!;
  }

  /**
   * Image upload
   * @param formData form data
   */
  const upload = (formData: FormData): Promise<any> => {
    return fetch(
      apiUrl + '/images/upload',
      {
        method: 'POST',
        body: formData,
      } as RequestInit);
  };


  /**
   * Recognize races on image
   * @param key image key for recognition
   */
  const recognizeFaces = async (key: string): Promise<RecogniseImage> => {
    const res = await fetch(
      apiUrl + '/images/' + key + '/process',
      {
        method: 'POST',
        'content-type': 'application/json',
      } as RequestInit);

    const result = await res.json() as unknown as {
      success: boolean,
      message?: string,
      data?: RecogniseImage,
    };

    if (!result.success) {
      throw new Error(result.message!);
    }

    return result.data!;
  };

  return {
    getList,
    upload,
    recognizeFaces,
  };
}

export default ImageApi();

