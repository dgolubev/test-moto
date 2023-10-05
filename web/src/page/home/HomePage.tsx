import React from 'react';
import { authProvider } from '../../service/authService';
import { redirect } from 'react-router-dom';
import { AppRoutes } from '../../router';

function HomePage() {
  return <h3>HOME</h3>;
}

async function loader() {
  if (!authProvider.isAuthenticated()) {
    return redirect(AppRoutes.LOGIN);
  }

  return null;
}

export {
  HomePage as component,
  loader,
}
