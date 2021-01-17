import React from 'react';
import { Route, useParams, Redirect } from 'react-router-dom';

function PrivateRoute({ children, ...rest }) {
  const { customerId } = useParams();
  const ifThereIsAuser = localStorage.getItem(`user-${customerId}`);
  return (
    <Route
      {...rest}
      render={({ location }) => {
        if (!ifThereIsAuser) {
          return children;
        }
        return (
          <Redirect
            to={{
              pathname: '/',
              state: { from: location },
            }}
          />
        );
      }}
    />
  );
}

export default PrivateRoute;
