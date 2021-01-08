import React from 'react';
import { SupportColumns } from '../Tables/TableColumns';
import { uuid } from '../../_utils/fx';

function SupportTable({ messages }) {
  return messages.map(({ from, message, date, messageType, read, resolved }) => {
    const fromValue = { from };
    const messageValue = { message };
    const dateValue = { date };
    const typeValue = { messageType };
    const readValue = { read };
    const resolvedValue = { resolved };

    console.log('read', resolved, read, resolvedValue, readValue);
    return (
      <tr key={uuid()} className='noClick'>
        <SupportColumns.FromColumn {...fromValue} />
        <SupportColumns.SubjectColumn {...messageValue} />
        <SupportColumns.DateColumn {...dateValue} />
        <SupportColumns.TypeColumn {...typeValue} />
        <SupportColumns.ReadColumn {...readValue} />
        <SupportColumns.ResolvedColumn {...resolvedValue} />
      </tr>
    );
  });

  // return csvs.map() => {
  //   return <h1>ddj</h1>
  // }
}

export default SupportTable;
