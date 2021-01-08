import React, { createContext, useContext, useState } from 'react';

const UserContext = createContext(undefined);
const UserDispatchContext = createContext(undefined);

function UserProvider({ children }) {
  const [userDetails, setUserDetails] = useState(null);

  return (
    <UserContext.Provider value={userDetails}>
      <UserDispatchContext.Provider value={setUserDetails}>{children}</UserDispatchContext.Provider>
    </UserContext.Provider>
  );
}

function useUserState() {
  const context = useContext(UserContext);

  if (context === undefined) {
    throw new Error('useUserState must be used within a UserProvider');
  }

  return context;
}

function useUserDispatch() {
  const context = useContext(UserDispatchContext);

  if (context === undefined) {
    throw new Error('useUserDispatch must be used within a UserProvider');
  }

  return context;
}

export { UserProvider, useUserState, useUserDispatch };

export default UserContext;
