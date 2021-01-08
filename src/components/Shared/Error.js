import React from 'react';
import { useTranslation } from 'react-i18next';
import { useUserState } from '../../contexts/UserContext';
import { getCustomerIdFromToken } from '../../_utils/auth';
import { logOut } from '../../_utils/auth';
import EmptyTable from '../EmptyData/EmptyTable';

function Error({ error: { status } }) {
  const { t } = useTranslation();

  const { token } = useUserState();
  if (status === 401) {
    logOut(getCustomerIdFromToken(token));
    return null;
  }

  return <EmptyTable errorTitle='' errorSubtitle={`${t('emptyData.somethingWentWrong')}`} />;
}

export default Error;
