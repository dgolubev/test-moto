import { useRouteLoaderData } from 'react-router';
import { useFetcher } from 'react-router-dom';
import { AppRoutes } from '../router';

export default function AuthStatus() {
  let { user } = useRouteLoaderData('root') as { user: string | null };
  let fetcher = useFetcher();

  if (!user) {
    return <p>You are not logged in.</p>;
  }

  let isLoggingOut = fetcher.formData != null;

  return (
    <div>
      <p>Welcome {user}!</p>
      <fetcher.Form method="post" action={AppRoutes.LOGOUT}>
        <button type="submit" disabled={isLoggingOut}>
          {isLoggingOut ? "Signing out..." : "Sign out"}
        </button>
      </fetcher.Form>
    </div>
  );
}
