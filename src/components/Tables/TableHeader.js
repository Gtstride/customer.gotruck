import React from 'react';
import { useTranslation } from 'react-i18next';
import { uuid } from '../../_utils/fx';

function TableHeader({ headers }) {
  const { t } = useTranslation();

  return (
    <thead id='tableHeader'>
      <tr className='tableHeaderRow'>
        {headers.map(header => (
          <th data-table-heading={header} key={uuid()}>
            <span className='tableTitle'>{header === '' ? '' : t(`tableHeaders.${header}`)}</span>
          </th>
        ))}
      </tr>
    </thead>
  );
}

export default TableHeader;
