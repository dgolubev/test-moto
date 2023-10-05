import React, { JSX } from "react";
import {
  Form,
  LoaderFunctionArgs,
  redirect,
  useActionData,
  useNavigation,
} from 'react-router-dom';
import { authProvider } from '../../service/authService';
import { AppRoutes } from '../../router';

const FIELD = {
  userName: {
    title: 'Username',
    name: 'userName',
  },
};

function LoginPage(): JSX.Element {
  let isLoggingIn = useNavigation().formData?.get("username") != null;

  const actionData = useActionData() as { error?: string };

  return (
    <div className="Login">
      <Form method="POST" replace>
        <label>
          <p>{FIELD.userName.title}</p>
          <input name={FIELD.userName.name} type="text"/>
        </label>

        <button type="submit" disabled={isLoggingIn}>
          {isLoggingIn ? "Logging in..." : "Login"}
        </button>

        {
          actionData && actionData.error
            ? <p style={{ color: "red" }}>{actionData.error}</p>
            : null
        }
      </Form>
    </div>
  );
}

async function loginAction({ request }: LoaderFunctionArgs) {
  let formData = await request.formData();
  let userName = formData.get(FIELD.userName.name) as string;

  if (!userName) {
    return {
      error: 'You must provide a username to log in',
    };
  }

  // Sign in and redirect to the proper destination if successful.
  try {
    await authProvider.signIn(userName);
  } catch (error) {
    return {
      error: 'Invalid login attempt',
    };
  }

  return redirect(AppRoutes.HOME);
}

async function loginLoader() {
  if (authProvider.isAuthenticated()) {
    return redirect(AppRoutes.HOME);
  }

  return null;
}

export {
  LoginPage as component,
  loginAction as action,
  loginLoader as loader,
};
