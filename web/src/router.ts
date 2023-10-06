import {
  createBrowserRouter,
  redirect,
} from "react-router-dom";
import { authProvider } from './service/authProvider';
import * as LoginPage from './page/login/LoginPage';
import { Layout } from './page/Layout';
import * as ImagesPage from './page/images/ImagesPage';

enum AppRoutes {
  HOME = '/',
  LOGIN = '/login',
  LOGOUT = '/logout',
}

const router = createBrowserRouter([
  {
    id: 'root',
    path: AppRoutes.HOME,
    loader: () => {
      return {
        user: authProvider.getUserName(),
      };
    },
    Component: Layout,
    children: [
      {
        index: true,
        loader: ImagesPage.loader,
        Component: ImagesPage.component,
      },

      {
        path: AppRoutes.LOGIN,
        action: LoginPage.action,
        Component: LoginPage.component,
      },
    ],
  },
  {
    path: AppRoutes.LOGOUT,
    async action() {
      await authProvider.signOut();

      return redirect(AppRoutes.HOME);
    },
  },
]);

export {
  router,
  AppRoutes,
}
