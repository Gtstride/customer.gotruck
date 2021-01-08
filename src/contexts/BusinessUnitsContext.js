import React, { createContext, useContext, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { isArrayEmpty } from '../_utils/fx';

const BusinessUnitsContext = createContext(undefined);
const BusinessUnitsDispatchContext = createContext(undefined);

function BusinessUnitsProvider({ children }) {
  const [businessUnitsDetails, setBusinessUnitsDetails] = useState([]);
  const { t } = useTranslation();

  useEffect(() => {
    if (!isArrayEmpty(businessUnitsDetails)) {
      const allUnits = {
        id: 0,
        name: <>{t('common.allUnits')}</>,
        customer_id: businessUnitsDetails[0].customer_id,
      };

      businessUnitsDetails.unshift(allUnits);
    }
  }, [businessUnitsDetails, t]);

  return (
    <BusinessUnitsContext.Provider value={businessUnitsDetails}>
      <BusinessUnitsDispatchContext.Provider value={setBusinessUnitsDetails}>
        {children}
      </BusinessUnitsDispatchContext.Provider>
    </BusinessUnitsContext.Provider>
  );
}

function useBusinessUnitsState() {
  const context = useContext(BusinessUnitsContext);

  if (context === undefined) {
    throw new Error('useBusinessUnitsState must be used within a BusinessUnitsProvider');
  }

  return context;
}

function useBusinessUnitsDispatch() {
  const context = useContext(BusinessUnitsDispatchContext);

  if (context === undefined) {
    throw new Error('useBusinessUnitsDispatch must be used within a BusinessUnitsProvider');
  }

  return context;
}

export { BusinessUnitsProvider, useBusinessUnitsState, useBusinessUnitsDispatch };
