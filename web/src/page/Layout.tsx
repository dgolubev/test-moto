import {
  Link,
  Outlet,
} from 'react-router-dom';
import AuthStatus from '../components/AuthStatus';

function Layout() {
  return (
    <div>
      <AuthStatus />

      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/images">Images</Link>
        </li>
      </ul>

      <Outlet />
    </div>
  );
}

export {
  Layout,
}
