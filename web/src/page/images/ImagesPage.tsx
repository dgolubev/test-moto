import React, {
  JSX,
  useEffect,
  useState,
} from 'react';
import { authProvider } from '../../service/authService';
import { redirect } from 'react-router-dom';
import { AppRoutes } from '../../router';
import imageApi from '../../api/imageApi';
import { RecogniseImage, RecogniseImageState } from '../../type/RecogniseImage';

function ImagesPage(): JSX.Element {
  const IMAGE_STATE_NAME: {[key in RecogniseImageState]: string} = {
    [RecogniseImageState.UPLOADED]: 'Uploaded',
    [RecogniseImageState.IN_PROCESS]: 'In progress',
    [RecogniseImageState.DONE]: 'Done',
    [RecogniseImageState.ERROR]: 'Error',
  };

  const [data, setData] = useState<any[]>();

  async function fetchData() {
    const data = await imageApi.list() as any[];

    setData(data);
  }

  useEffect(() => {
    fetchData();
  }, []);

  const renderTable = () => {
    if (!data) {
      return <p>no images</p>;
    }

    return Object.entries(data).map(([key, item]:[string,  any]) => {
        return (
          <tr key={key}>
            <td>{item.name}</td>
            <td>{IMAGE_STATE_NAME[item.state as  RecogniseImageState]}</td>
          </tr>
        );
      });
  }

  return (
    <>
      <h1>Images Page</h1>
      <h3>upload image:</h3>
      <table className="images">
        <caption>List of images:</caption>
        <tbody>
          {renderTable()}
        </tbody>
      </table>
    </>
  );
}

async function loader() {
  if (!authProvider.isAuthenticated()) {
    return redirect(AppRoutes.LOGIN);
  }

  return null;
}

export {
  ImagesPage as component,
  loader,
};
