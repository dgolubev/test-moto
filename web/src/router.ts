import {
  createBrowserRouter,
  redirect,
} from "react-router-dom";
import { authProvider } from './service/authService';
import * as LoginPage from './page/login/LoginPage';
import { Layout } from './page/Layout';
import { HomePage } from './page/home/HomePage';
import * as ImagesPage from './page/images/ImagesPage';

enum AppRoutes {
  HOME = '/',
  LOGIN = '/login',
  LOGOUT = '/',
  IMAGES = '/images',
}

const router = createBrowserRouter([
  {
    id: 'root',
    path: AppRoutes.HOME,
    Component: Layout,
    children: [
      {
        index: true,
        Component: HomePage,
      },
      {
        path: AppRoutes.LOGIN,
        action: LoginPage.action,
        loader: LoginPage.loader,
        Component: LoginPage.component,
      },
      {
        path: AppRoutes.IMAGES,
        loader: ImagesPage.loader,
        Component: ImagesPage.component,
      },
    ],
  },
  {
    path: AppRoutes.LOGOUT,
    async action() {
      // We signout in a "resource route" that we can hit from a fetcher.Form
      await authProvider.signOut();

      return redirect(AppRoutes.HOME);
    },
  },
]);

export {
  router,
  AppRoutes,
}
