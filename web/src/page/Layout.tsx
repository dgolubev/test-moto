import {
  Link,
  Outlet,
} from 'react-router-dom';

function Layout() {
  return (
    <div>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
      </ul>

      <Outlet />
    </div>
  );
}

export {
  Layout,
}
