import React from 'react';
import { uuid, getDash } from '../../_utils/fx';

function InsuranceTable({ recipients, setModal }) {
  return recipients.map(rec => {
    const { insuranceType, policyNumber, companyKey, country, status } = rec;
    // let addressValue = { address, recipientId: id, setModal, totalAddress: addresses.length };
    // ?? Check the function switchRecipientAddress to learn more
    // const newRecipientAddress = switchRecipientAddress(addresses);
    // if (newRecipientAddress !== undefined) {
    //   addressValue = { ...addressValue, address: newRecipientAddress };
    // }

    // const policyNumberValue = { policyNumber, recipientId: _id, setModal };
    // const insuranceTypeValue = { insuranceType, recipientId: _id, setModal };
    // const companyKeyValue = { companyKey, recipientId: _id, setModal };
    // const countryValue = { country, recipientId: _id, setModal };
    // const statusValue = { status, recipientId: _id, setModal };
    // const dateCreatedValue = {
    //   dateCreated: format(new Date(created), 'd MMMM, yyyy'),
    //   recipientId: id,
    //   setModal,
    // };
    // const phoneValue = { phone: mobile, recipientId: id, setModal };

    return (
      <tr key={uuid()} className='noClick'>
        <td>
          <div className='tableItem'>
            <p className='ln-22'>
              <button
                type='button'
                // onClick={() => setModal({ showModal: true, modalType: crudEnums.READ, modalItemId: recipientId })}
              >
                {policyNumber || getDash()}
              </button>
            </p>
          </div>
        </td>
        <td>
          <div className='tableItem'>
            <p className='ln-22'>
              <button
                type='button'
                // onClick={() => setModal({ showModal: true, modalType: crudEnums.READ, modalItemId: recipientId })}
              >
                {insuranceType || getDash()}
              </button>
            </p>
          </div>
        </td>
        <td>
          <div className='tableItem'>
            <p className='ln-22'>
              <button
                type='button'
                // onClick={() => setModal({ showModal: true, modalType: crudEnums.READ, modalItemId: recipientId })}
              >
                {companyKey || getDash()}
              </button>
            </p>
          </div>
        </td>
        <td>
          <div className='tableItem'>
            <p className='ln-22'>
              <button
                type='button'
                // onClick={() => setModal({ showModal: true, modalType: crudEnums.READ, modalItemId: recipientId })}
              >
                {country || getDash()}
              </button>
            </p>
          </div>
        </td>
        <td className='StatusColumn'>
          <div className='tableItem' style={{ display: 'flex', alignItems: 'center' }}>
            <div
              className={`tableItemLeft statusHalo 
                ${(status.toLowerCase() === 'cancelled' && 'bg-clr-red') ||
                  (status.toLowerCase() === 'pending' && 'bg-clr-yellow') ||
                  (status.toLowerCase() === 'in-premise' && 'bg-clr-tblue') ||
                  (status.toLowerCase() === 'positioned' && 'bg-clr-yellow')}
            `}
            />
            <p className='ln-22'>{status || getDash()}</p>
          </div>
        </td>
        {/* <td>
          <div className='tableItem'>
            <p className='ln-22'>
              <button
                type='button'
                // onClick={() => setModal({ showModal: true, modalType: crudEnums.READ, modalItemId: recipientId })}
              >
                {status}
              </button>
            </p>
          </div>
        </td> */}

        {/* <policyRequestColumns.policyNumber {...policyNumberValue} />
        <policyRequestColumns.insuranceType {...insuranceTypeValue} />
        <policyRequestColumns.companyKey {...companyKeyValue} />
        <policyRequestColumns.country {...countryValue} />
        <policyRequestColumns.status {...statusValue} /> */}

        {/* <recipientsColumns.NameColumn {...nameValue} />
        <recipientsColumns.PhoneColumn {...phoneValue} />
        <recipientsColumns.DateAddedColumn {...dateCreatedValue} />
        <recipientsColumns.AddressColumn {...addressValue} /> */}
        {/* <recipientsColumns.ActionsColumn {...{ recipientId: id, setModal }} /> */}
      </tr>
    );
  });
}

export default InsuranceTable;