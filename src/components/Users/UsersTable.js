import React from 'react';
import { uuid, getDash } from '../../_utils/fx';
import { usersColumns } from '../Tables/TableColumns';
import { format } from 'date-fns';

function UsersTable({ users, setModal }) {
  return users.map(({ first_name, last_name, joined, email, mobile, sectionName, id, image }) => {
    const nameValue = { name: `${first_name} ${last_name}`, setModal, userId: id, image, first_name, last_name };
    const dateCreatedValue = {
      dateCreated: format(new Date(joined), 'd MMMM, yyyy'),
      userId: id,
      setModal,
    };
    const phoneValue = { phone: mobile, userId: id, setModal };
    const emailValue = { userId: id, setModal, email };
    const businessValue = { businessUnit: sectionName || getDash(), userId: id, setModal };

    return (
      <tr key={uuid()} className='noClick'>
        <usersColumns.NameColumn {...nameValue} />
        <usersColumns.EmailColumn {...emailValue} />
        <usersColumns.PhoneColumn {...phoneValue} />
        <usersColumns.BusinessColumn {...businessValue} />
        <usersColumns.DateAddedColumn {...dateCreatedValue} />
        <usersColumns.ActionsColumn {...{ userId: id, setModal }} />
      </tr>
    );
  });
}

export default UsersTable;
