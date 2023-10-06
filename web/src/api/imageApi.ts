import {
  RecogniseImage,
  RecogniseImageState,
} from '../type/RecogniseImage';
import {
  AuthProvider,
  authProvider,
} from '../service/authProvider';

const ImageApi = (
  authProvider: AuthProvider,
): {
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
          'Authorization': authProvider.getToken(),
        },
      } as RequestInit);

    const result = await res.json() as unknown as {
      success: boolean,
      message?: string,
      data?: Record<string, RecogniseImage>,
    };

    return result.success ? result.data! : {};
  }

  /**
   * Image upload
   * @param formData form data
   */
  const upload = async (formData: FormData): Promise<void> => {
    await fetch(
      apiUrl + '/images/upload',
      {
        method: 'POST',
        headers: {
          'Authorization': authProvider.getToken(),
        },
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
        headers: {
          'content-type': 'application/json',
          'Authorization': authProvider.getToken(),
        },
      } as RequestInit);

    const result = await res.json() as unknown as {
      success: boolean,
      message?: string,
      data?: RecogniseImage,
    };

    if (!result.success) {
      return {
        state: RecogniseImageState.ERROR,
      } as RecogniseImage;
    }

    return result.data!;
  };

  return {
    getList,
    upload,
    recognizeFaces,
  };
}

export default ImageApi(
  authProvider,
);

