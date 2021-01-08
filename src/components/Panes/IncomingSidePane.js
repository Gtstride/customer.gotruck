import React from 'react';
import { useHistory, useParams } from 'react-router-dom';

import OrderSidePaneStyle from '../../styles/OrderSidePaneStyle';
import { useUserState } from '../../contexts/UserContext';

function IncomingSidePane({ truck, t, setModal }) {
  const { push } = useHistory();
  const { customerId } = useParams();
  const { adminId } = useUserState();
  return (
    <OrderSidePaneStyle>
      <div className='truckActions'>
        <div className='card tripPrice'>
          <div className='cardIconBlock bd-rad-5' data-align='center-both'></div>
        </div>
        <p>
          <>{t('incomingTruck.truckActions')}</>
        </p>
      </div>
      <div className='tripStatus'>
        <div className={`halo ${truck.status ? truck.status.toLowerCase() : ''}`} />
        <div className='status'>
          <p>
            <>{t('incomingTruck.truckStatus')}</>
          </p>
          <p>{(truck.status.toLowerCase() === 'pending' && 'Available') || (truck.status.toLowerCase() === 'pending' && 'Available') || truck.status}</p>
        </div>
      </div>
      <div className='btns'>
        {(truck.status && truck.status.toLowerCase() === 'pending' && (
          <button
            className='setAct'
            style={{ backgroundColor: '#23a4d7' }}
            onClick={() =>
              setModal({
                showModal: true,
                modalItemId: truck._id,
                modalType: 'setToAccept',
              })
            }
          >
            <>{t('buttons.setToAccept')}</>
          </button>
        )) ||
          (truck.status && truck.status.toLowerCase() === 'available' && (
            <button
              className='setAct'
              style={{ backgroundColor: '#F9AC1B'}}
              onClick={() =>
                setModal({
                  showModal: true,
                  modalItemId: truck._id,
                  modalType: 'setToPositioned',
                })
              }
            >
              <>{t('buttons.setToPos')}</>
            </button>
          )) ||
          (truck.status && truck.status.toLowerCase() === 'positioned' && (
            <button
              className='setAct'
              style={{ backgroundColor: '#fcab31' }}
              onClick={() =>
                setModal({
                  showModal: true,
                  modalItemId: truck._id,
                  modalType: 'setToInPremise',
                })
              }
            >
              <>{t('buttons.setToInPrem')}</>
            </button>
          )) ||
          (truck.status &&
            truck.status.toLowerCase() === 'in-premise' &&
            (adminId && (truck.customerAccountName === undefined || truck.customerAccountName === '') ? (
              <button
                style={{ backgroundColor: '#37b47f' }}
                className='setAct'
                onClick={() =>
                  push(`/${customerId}/truck_requests/load_trucks`, {
                    step: 'business_account',
                    truckPool: truck._id,
                    truckRequestId: truck.truckRequestId,
                    // type,
                    params: {
                      driver: truck.driver,
                      customerId: truck.customerId,
                      customerName: truck.customerName,
                      customerPhone: truck.customerPhone,
                      partner: truck.partner,
                      requestType: truck.requestType || 'new',
                    },
                  })
                }
              >
                <>{t('buttons.loadTrucks')}</>
              </button>
            ) : (
              <button
                style={{ backgroundColor: '#37b47f' }}
                disabled={!truck.carriage && !truck.partner}
                className='setAct'
                onClick={() =>
                  push(`/${customerId}/truck_requests/load_trucks`, {
                    step: 'customer_routes',
                    truckPool: truck._id,
                    truckRequestId: truck.truckRequestId,
                    // type,
                    params: {
                      driver: truck.driver,
                      customerId: truck.customerId,
                      customerName: truck.customerName,
                      customerPhone: truck.customerPhone,
                      partner: truck.partner,
                      requestType: truck.requestType || 'new',
                      carriage: truck.carriage ? truck.carriage : truck.partner
                    },
                  })
                }
              >
                <>{t('buttons.loadTrucks')}</>
              </button>
            )))}

        <button
          className='setAct'
          style={{ backgroundColor: 'var(--red)' }}
          onClick={() =>
            setModal({
              showModal: true,
              modalItemId: truck._id,
              modalType: 'removeAllocation',
            })
          }
        >
          <>{t('buttons.deleteTruck')}</>
        </button>

        {truck.truckRequestId && (
          <button
            style={{ backgroundColor: 'var(--blue)', color: '#fff' }}
            className='setAct'
            onClick={() => push(`/${customerId}/truck_requests/${truck.truckRequestId}`)}
          >
            <>{t('truckPool.viewRequest')}</>
          </button>
        )}
      </div>
    </OrderSidePaneStyle>
  );
}

export default IncomingSidePane;
