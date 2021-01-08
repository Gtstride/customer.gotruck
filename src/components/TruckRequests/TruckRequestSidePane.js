import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import AddSVGIcon from '../../assets/icons/add.svg';
import CancelOrderSVGIcon from '../../assets/icons/cancel.svg';
import TaxiDriverSVGIcon from '../../assets/icons/truck-cargo.svg';
import OrderSidePaneStyle from '../../styles/OrderSidePaneStyle';

function TruckRequestSidePane({ status = '', setModal, clone, truckRequest }) {
  const { t } = useTranslation();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  console.log('clone', clone);

  if (searchParams.get('type') === 'bulk') {
    return (
      <OrderSidePaneStyle>
        <div className='truckRequestStatusBlock'>
          <div className='orderStatus'>
            <p>{<>{t('truckRequests.totalRequestStatus')}</>}</p>
            <div className='truckHaloStatus'>
              <div className={`halo ${status}`}></div>
              <p>{status}</p>
            </div>
          </div>
        </div>
      </OrderSidePaneStyle>
    );
  }

  if (truckRequest.accessType && truckRequest.accessType.toLowerCase() === 'open') {
    return (
      <OrderSidePaneStyle>
        <div className='truckRequestStatusBlock'>
          <div className='orderStatus'>
            <p>{<>{t('truckRequests.totalRequestStatus')}</>}</p>
            <div className='truckHaloStatus'>
              <div className={`halo ${truckRequest.status.toLowerCase()}`}></div>
              <p>{truckRequest.status}</p>
            </div>
          </div>
        </div>
        {truckRequest.status === 'open' && (
          <>
            <div className='orderEditActionBlock'>
              {clone ? (
                <button
                  type='button'
                  className='editTruckRequestButton'
                  onClick={() => {
                    setModal({
                      showModal: true,
                      modalType: 'clone',
                      modalItemId: undefined,
                    });
                  }}
                >
                  <span className='buttonIcon'>
                    <img src={TaxiDriverSVGIcon} alt='clone truck request' />
                  </span>
                  <span className='buttonText clr-purple'>{<>{t('forms.cloneTruckRequest')}</>}</span>
                </button>
              ) : (
                <button
                  type='button'
                  className='editTruckRequestButton'
                  onClick={() => {
                    setModal({
                      showModal: true,
                      modalType: 'edit',
                      modalItemId: undefined,
                    });
                  }}
                >
                  <span className='buttonIcon'>
                    <img src={TaxiDriverSVGIcon} alt='edit truck request' />
                  </span>
                  <span className='buttonText clr-purple'>{<>{t('truckRequests.editTruckRequest')}</>}</span>
                </button>
              )}
            </div>
            <div className='orderEditActionBlock'>
              <button
                type='button'
                className='assignToTransporterButton'
                onClick={() => {
                  setModal({
                    showModal: true,
                    modalType: 'assign',
                    modalItemId: undefined,
                  });
                }}
              >
                <span className='buttonIcon'>
                  <img src={AddSVGIcon} alt='assign truck to transporter' />
                </span>
                <span className='buttonText clr-green'>{<>{t('truckRequests.assignToTransporter')}</>}</span>
              </button>
            </div>
            <div className='orderEditActionBlock'>
              {!clone && (
                <button
                  type='button'
                  className='editPriceButton'
                  onClick={() => {
                    setModal({
                      showModal: true,
                      modalType: 'cancel',
                      modalItemId: undefined,
                    });
                  }}
                >
                  <span className='buttonIcon'>
                    <img src={CancelOrderSVGIcon} alt='cancel truck request' />
                  </span>
                  <span className='buttonText clr-red'>{<>{t('truckRequests.cancelTruckRequest')}</>}</span>
                </button>
              )}
            </div>
          </>
        )}
      </OrderSidePaneStyle>
    );
  }

  if (truckRequest.accessType && truckRequest.accessType.toLowerCase() === 'dt') {
    return (
      <OrderSidePaneStyle>
        <div className='truckRequestStatusBlock'>
          <div className='orderStatus'>
            <p>{<>{t('truckRequests.totalRequestStatus')}</>}</p>
            <div className='truckHaloStatus'>
              <div className={`halo ${truckRequest.status.toLowerCase()}`}></div>
              <p>{truckRequest.status}</p>
            </div>
          </div>
        </div>
        {truckRequest.status === 'open' && (
          <>
            <div className='orderEditActionBlock'>
              {clone ? (
                <button
                  type='button'
                  className='editTruckRequestButton'
                  onClick={() => {
                    setModal({
                      showModal: true,
                      modalType: 'clone',
                      modalItemId: undefined,
                    });
                  }}
                >
                  <span className='buttonIcon'>
                    <img src={TaxiDriverSVGIcon} alt='clone truck request' />
                  </span>
                  <span className='buttonText clr-purple'>{<>{t('forms.cloneTruckRequest')}</>}</span>
                </button>
              ) : (
                <button
                  type='button'
                  className='editTruckRequestButton'
                  onClick={() => {
                    setModal({
                      showModal: true,
                      modalType: 'edit',
                      modalItemId: undefined,
                    });
                  }}
                >
                  <span className='buttonIcon'>
                    <img src={TaxiDriverSVGIcon} alt='edit truck request' />
                  </span>
                  <span className='buttonText clr-purple'>{<>{t('truckRequests.editTruckRequest')}</>}</span>
                </button>
              )}
            </div>
            <div className='orderEditActionBlock'>
              {!clone && (
                <button
                  type='button'
                  className='editPriceButton'
                  onClick={() => {
                    setModal({
                      showModal: true,
                      modalType: 'cancel',
                      modalItemId: undefined,
                    });
                  }}
                >
                  <span className='buttonIcon'>
                    <img src={CancelOrderSVGIcon} alt='cancel truck request' />
                  </span>
                  <span className='buttonText clr-red'>{<>{t('truckRequests.cancelTruckRequest')}</>}</span>
                </button>
              )}
            </div>
          </>
        )}
      </OrderSidePaneStyle>
    );
  }

  return (
    <OrderSidePaneStyle>
      <div className='truckRequestStatusBlock'>
        <div className='orderStatus'>
          <p>{<>{t('truckRequests.totalRequestStatus')}</>}</p>
          <div className='truckHaloStatus'>
            <div className={`halo ${truckRequest.status ? truckRequest.status.toLowerCase() : ''}`}></div>
            <p>{truckRequest.status}</p>
          </div>
        </div>
      </div>
      {truckRequest.status === 'open' && (
        <>
          <div className='orderEditActionBlock'>
            <button
              type='button'
              className='assignToTransporterButton'
              onClick={() => {
                setModal({
                  showModal: true,
                  modalType: 'assignBulk',
                  modalItemId: undefined,
                });
              }}
            >
              <span className='buttonIcon'>
                <img src={AddSVGIcon} alt='assign truck to transporter' />
              </span>
              <span className='buttonText clr-green'>{<>{t('truckRequests.assignToTransporter')}</>}</span>
            </button>
          </div>
        </>
      )}
    </OrderSidePaneStyle>
  );
}

export default TruckRequestSidePane;
