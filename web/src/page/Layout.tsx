import { Outlet } from 'react-router-dom';
import AuthStatus from '../components/AuthStatus';

function Layout() {
  return (
    <div>
      <AuthStatus />

      <Outlet />
    </div>
  );
}

export {
  Layout,
}
