import React, {
  ChangeEvent,
  JSX,
  useEffect,
  useState,
} from 'react';
import { authProvider } from '../../service/authProvider';
import {
  redirect,
  useNavigate,
} from 'react-router-dom';
import { AppRoutes } from '../../router';
import imageApi from '../../api/imageApi';
import {
  RecogniseImage,
  RecogniseImageState,
} from '../../type/RecogniseImage';

function ImagesPage(): JSX.Element {
  const IMAGE_STATE_NAME: { [key in RecogniseImageState]: string } = {
    [RecogniseImageState.UPLOADED]: 'Uploaded',
    [RecogniseImageState.IN_PROCESS]: 'In progress',
    [RecogniseImageState.DONE]: 'Done',
    [RecogniseImageState.ERROR]: 'Error',
  };

  const navigate = useNavigate();

  const [images, setImages] = useState<Map<string, RecogniseImage>>(new Map());
  const [uploadImage, setUploadImage] = useState<File>();

  useEffect(() => {
    checkAuth();
  });

  useEffect(() => {
    fetchImages();
  }, []);

  async function checkAuth() {
    if (await authProvider.isAuthenticated()) {
      return;
    }

    authProvider.signOut();

    navigate(AppRoutes.LOGIN);
  }

  async function fetchImages() {
    setImages(new Map(Object.entries(await imageApi.getList())));
  }

  const renderListOfImages = () => {
    if (images.size === 0) {
      return <p>no images</p>;
    }

    const tBody =
      [...images.values()]
      .map((item:RecogniseImage) => {
        return (
          <tr key={item.key}>
            <td>{item.name}</td>
            <td>{IMAGE_STATE_NAME[item.state as RecogniseImageState]}</td>
            <td>{item.faces && item.faces.length}</td>
          </tr>
        );
      });

    return (
      <table className="images-list">
        <thead>
          <tr>
            <th>Image</th>
            <th>Status</th>
            <th>Faces Count</th>
          </tr>
        </thead>
        <tbody>{tBody}</tbody>
      </table>
    );
  }

  const handleSelectFile = (event: ChangeEvent<HTMLInputElement>) => {
    const { files } = event.target;
    const selectedFiles = files as FileList;

    setUploadImage(selectedFiles?.[0]);
  };

  const handleUploadFile = async () => {
    if (!uploadImage) {
      return;
    }

    const formData = new FormData();
    formData.append("image", uploadImage);
    formData.append("text", 'test text');

    try {
      await imageApi.upload(
        formData,
      );

      await fetchImages();
    } catch (err) {
      console.log('error', err);
    }
  };

  const handleRecognise = async (): Promise<void> => {
    if (images.size === 0) {
      return;
    }

    await Promise.all(
      [...images.values()]
        .filter((img:RecogniseImage) => RecogniseImageState.DONE !== img.state)
        .map(async (img:RecogniseImage) => {
          //  set status
          img.state = RecogniseImageState.IN_PROCESS;
          images.set(img.key, img);
          setImages(new Map(images));

          const result = await imageApi.recognizeFaces(img.key);

          images.set(
            img.key,
            {
              ...img,
              state: result.state,
              faces: result.faces ?? undefined,
            }
          );

          setImages(new Map(images));
        })
    );
  }

  const renderUploadForm = () => {
    return (
      <>
        {
          uploadImage &&
          <>
            <img src={URL.createObjectURL(uploadImage)}
                 className="image-preview"
                 alt="preview"
            />
            <br />
          </>
        }

        <label>Select image:</label>
        <input
          type="file"
          required
          onChange={handleSelectFile}
        ></input>

        <br/>
        <button
          disabled={!uploadImage}
          onClick={handleUploadFile}
        >
          Upload
        </button>
      </>
    );
  }

  return (
    <>
      <h1>Images Page</h1>

      <hr/>
      <h3>upload image:</h3>
      {renderUploadForm()}

      <hr/>
      <h3>List of images:</h3>
      {renderListOfImages()}

      <hr/>
      <button
        disabled={images.size === 0}
        onClick={handleRecognise}
      >
        Recognize
      </button>

    </>
  );
}

async function loader() {
  if (!await authProvider.isAuthenticated()) {
    return redirect(AppRoutes.LOGIN);
  }

  return null;
}

export {
  ImagesPage as component,
  loader,
};
