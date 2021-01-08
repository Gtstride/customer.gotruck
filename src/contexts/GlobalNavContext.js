import React, { createContext, useContext, useState } from 'react';

const GlobalNavContext = createContext(undefined);
const GlobalNavDispatchContext = createContext(undefined);

function GlobalNavProvider({ children }) {
  const [globalNavDetails, setGlobalNavDetails] = useState({
    navTitle: undefined,
    itemId: undefined,
  });

  return (
    <GlobalNavContext.Provider value={globalNavDetails}>
      <GlobalNavDispatchContext.Provider value={setGlobalNavDetails}>{children}</GlobalNavDispatchContext.Provider>
    </GlobalNavContext.Provider>
  );
}

function useGlobalNavState() {
  const context = useContext(GlobalNavContext);

  if (context === undefined) {
    throw new Error('useGlobalNavState must be used within a GlobalNavProvider');
  }

  return context;
}

function useGlobalNavDispatch() {
  const context = useContext(GlobalNavDispatchContext);

  if (context === undefined) {
    throw new Error('useGlobalNavDispatch must be used within a GlobalNavProvider');
  }

  return context;
}

export { GlobalNavProvider, useGlobalNavState, useGlobalNavDispatch };
