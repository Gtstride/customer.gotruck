import moment from 'moment';
import React from 'react';
import Moment from 'react-moment';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import PlusIcon from '../../assets/icons/add-green.svg';
import bin from '../../assets/icons/bin.svg';
import RemoveTransporterIcon from '../../assets/icons/remove-transporter.svg';
import wench from '../../assets/icons/wench.svg';
import { crudEnums } from '../../_utils/constants';
import { getDash, uuid } from '../../_utils/fx';
import StarRating from '../General/StarRating';

// -> Columns for Trips
const tripsColumns = {
  TripIdorDateColumn({ tripId, tripDate, url = '' }) {
    return (
      <td className='tripsTripIdorDateColumn'>
        <Link to={url}>
          <div className='tableItem'>
            <p className='mg-btm-4 ln-22'>{tripId || getDash()}</p>
            <p className='secColor ln-16'>{tripDate || getDash()}</p>
          </div>
        </Link>
      </td>
    );
  },

  WaybillColumn({ waybillCount = 0, url = '', salesOrder }) {
    return (
      <td className='tripsWaybillColumn'>
        <Link to={url}>
          <div className='tableItem flex'>
            <div className={`${waybillCount > 0 && 'tableItemRight'}`}>
              <p>{salesOrder || getDash()}</p>
            </div>
          </div>
        </Link>
      </td>
    );
  },

  RouteColumn({
    pickupStation,
    deliveryStation,
    source,
    destination,
    isRouteCoLoaded,
    url = '',
    flagComment,
    flagReason,
    person,
    date,
  }) {
    const { t } = useTranslation();

    return (
      <td className='tripsRouteColumn'>
        <Link to={url}>
          <div className='tableItem'>
            {isRouteCoLoaded && (
              <span className='routeTag'>
                <>{t('common.coLoaded')}</>
              </span>
            )}
            <p className='mg-btm-4 ln-22'>
              {pickupStation || getDash()} <mark>to</mark> {deliveryStation}
            </p>
            <p className='mg-btm-10 ln-16'>
              {source} {getDash()} {destination}
            </p>
            {flagComment && <div className='mg-btm-10 dotted' />}
            <p className='mg-btm-4 ln-16' style={{ color: 'var(--red)' }}>
              {flagComment}
            </p>
            <p className='ln-16'>
              {flagReason}&nbsp; {person && '|'}&nbsp; {person}&nbsp;{' '}
              {date && (
                <>
                  | <Moment date={date} format='DD-MM-YYYY hh:mm A' />
                </>
              )}
            </p>
          </div>
        </Link>
      </td>
    );
  },

  AmountColumn({ amount, url }) {
    return (
      <td className='tripsPriceColumn'>
        <Link to={url}>
          <div className='tableItem'>
            <p className='ln-22'>{amount || getDash()}</p>
          </div>
        </Link>
      </td>
    );
  },

  DriverColumn({ driverName, driverMobileNo, url = '' }) {
    return (
      <td className='tripsDriverColumn'>
        <Link to={url}>
          <div className='tableItem flex'>
            <div className='tableItemLeft'>
              <p className='mg-btm-4 ln-22'>{driverName || getDash()}</p>
              <p className='secColor  ln-16'>{driverMobileNo || getDash()}</p>
            </div>
            {/* <div className='tableItemRight'>
              <p>{driverCount}</p>
            </div> */}
          </div>
        </Link>
      </td>
    );
  },

  TruckColumn({ truckId, truckType, url = '' }) {
    return (
      <td className='tripsTruckColumn'>
        <Link to={url}>
          <div className='tableItem'>
            {truckId && <p className=' mg-btm-4 ln-22'>{truckId}</p>}
            <p className='secColor  ln-16'>{truckType || getDash()}</p>
          </div>
        </Link>
      </td>
    );
  },

  RecipientColumn({ recipientName, recipientMobileNo, url = '' }) {
    return (
      <td className='tripsRecipientColumn'>
        <Link to={url}>
          <div className='tableItem flex'>
            <div className='tableItemLeft'>
              <>
                <p className='mg-btm-4 ln-22'>{recipientName || getDash()}</p>
                <p className='mg-btm-4 ln-22'>{recipientMobileNo || getDash()}</p>
              </>
            </div>
          </div>
        </Link>
      </td>
    );
  },

  StatusColumn({ status, url = '' }) {
    return (
      <td>
        <Link to={url}>
          <div className='tableItem flex'>
            <div
              className={`tableItemLeft statusHalo 
            ${
              (status.toLowerCase() === 'cancelled' && 'bg-clr-red') ||
              (status.toLowerCase() !== 'delivered' && 'bg-clr-yellow')
            }
            `}
            >
              <p></p>
            </div>
            <div className='tableItemRight tableItemLastCol ln-16'>
              <p>{(status.toLowerCase() === 'returningcontainer' && 'Returning container') || status}</p>
            </div>
          </div>
        </Link>
      </td>
    );
  },
};

// -> Columns for Orders
const ordersColumns = {
  OrderIdorDateColumn({ requestId, requestDate, url = '' }) {
    return (
      <td className='ordersIdorDateColumn'>
        <Link to={url}>
          <div className='tableItem'>
            <p className='mg-btm-4 ln-22'>{requestId}</p>
            <p className='secColor  ln-16'>{requestDate}</p>
          </div>
        </Link>
      </td>
    );
  },

  RouteColumn({ pickupStation, deliveryStation, source, destination, isRouteCoLoaded, url = '' }) {
    return (
      <td className='ordersRouteColumn'>
        <Link to={url}>
          <div className='tableItem'>
            {isRouteCoLoaded && <span className='routeTag'>co-loaded</span>}
            <p className='mg-btm-4 ln-22'>
              {pickupStation} <mark>to</mark> {deliveryStation}
            </p>
            <p className=' ln-16'>
              {source} {getDash()} {destination}
            </p>
          </div>
        </Link>
      </td>
    );
  },

  AmountColumn({ amount, url }) {
    return (
      <td className='ordersPriceColumn'>
        <Link to={url}>
          <div className='tableItem'>
            <p className='ln-22'>{amount}</p>
          </div>
        </Link>
      </td>
    );
  },

  TruckColumn({ truckType, url = '' }) {
    return (
      <td className='ordersTruckColumn'>
        <Link to={url}>
          <div className='tableItem'>
            <p className=' mg-btm-4 ln-22'>{truckType}</p>
          </div>
        </Link>
      </td>
    );
  },

  StatusColumn({ status, url = '' }) {
    return (
      <td className='ordersStatusColumn'>
        <Link to={url}>
          <div className='tableItem flex'>
            <div
              className={`tableItemLeft statusHalo 
            ${
              (status.toLowerCase() === 'cancelled' && 'bg-clr-red') ||
              (status.toLowerCase() === 'pending' && 'bg-clr-yellow')
            }
            `}
            >
              <p></p>
            </div>
            <div className='tableItemRight tableItemLastCol ln-16'>
              <p>{status}</p>
            </div>
          </div>
        </Link>
      </td>
    );
  },

  RecipientColumn({ recipientCount, url = '' }) {
    return (
      <td className='ordersRecipientColumn'>
        <Link to={url}>
          <div className='tableItem flex'>
            {(recipientCount && (
              <div className='tableItemRight bg-clr-red'>
                <p>+{recipientCount}</p>
              </div>
            )) || (
              <div className='tableItemRight bg-clr-white'>
                <p className='clr-black'>{getDash()}</p>
              </div>
            )}
          </div>
        </Link>
      </td>
    );
  },
};

// -> Columns for Routes
const routesColumns = {
  RouteCodeColumn({ routeCode }) {
    return (
      <td className='RouteCodeColumn'>
        <div className='tableItem'>
          <p className='mg-btm-4 ln-22'>{routeCode}</p>
        </div>
      </td>
    );
  },

  RouteColumn({ pickupStation, deliveryStation, source, destination }) {
    return (
      <td className='RouteColumn'>
        <div className='tableItem'>
          <p className='mg-btm-4 ln-22'>
            {pickupStation} <mark>to</mark> {deliveryStation}
          </p>
          <p className=' ln-16'>
            {source} {getDash()} {destination}
          </p>
        </div>
      </td>
    );
  },

  PriceColumn({ price }) {
    return (
      <td className='PriceColumn'>
        <div className='tablseItem'>
          <p className='ln-22'>{price}</p>
        </div>
      </td>
    );
  },

  TruckColumn({ truckType }) {
    return (
      <td className='TruckColumn'>
        <div className='tableItem'>
          <p className='secColor  ln-16'>{truckType}</p>
        </div>
      </td>
    );
  },

  ActionsColumn({ routeId, setModal }) {
    return (
      <td className='actionsColumn'>
        <div className='actionBlock'>
          <button
            title='Edit route'
            className='editBtn padding-unset padding-right--10'
            onClick={() => setModal({ showModal: true, modalType: 'update', modalItemId: routeId })}
          >
            <img src={wench} alt='edit button' />
          </button>
          <button
            title='Delete route'
            className='deleteBtn padding-unset padding-right--10'
            onClick={() => setModal({ showModal: true, modalType: 'delete', modalItemId: routeId })}
          >
            <img src={bin} alt='edit button' />
          </button>
        </div>
      </td>
    );
  },
};

// ->  Columns for Truck Pools
const TruckPoolsColumns = {
  RegNoColumn({ regNo, assetClass, url }) {
    return (
      <td className='RegNoColumn'>
        <Link to={url}>
          <div className='tableItem'>
            <div>
              <p className='mg-btm-4 ln-22'>{regNo}</p>
              <p className='secColor  ln-16'>{assetClass}</p>
            </div>
          </div>
        </Link>
      </td>
    );
  },

  RequestTypeColumn({ requestType, url }) {
    return (
      <td className='RequestTypeColumn'>
        <Link to={url}>
          {requestType && (
            <div className={`requestTypeBlock ${requestType.toLowerCase()}`}>{requestType || getDash()}</div>
          )}
        </Link>
      </td>
    );
  },

  ActivePartnerColumn({ partnerName, url }) {
    return (
      <td className='ActivePartnerColumn'>
        <Link to={url}>
          <div className='tableItem'>
            <p className='mg-btm-4 ln-22'>{partnerName}</p>
          </div>
        </Link>
      </td>
    );
  },

  DriverColumn({ driverName, mobile, createdDate, url }) {
    return (
      <td className='DriverColumn'>
        <Link to={url}>
          <div className='tableItem'>
            <p className='mg-btm-4 ln-22'>{`${driverName} ${getDash()} ${mobile}`}</p>
            <p className='secColor ln-16'>Date added: {createdDate}</p>
          </div>
        </Link>
      </td>
    );
  },

  StatusColumn({ status, url }) {
    return (
      <td className='StatusColumn'>
        <Link to={url}>
          <div className='tableItem' style={{ display: 'flex', alignItems: 'center' }}>
            <div
              className={`tableItemLeft statusHalo 
                ${
                  (status.toLowerCase() === 'cancelled' && 'bg-clr-red') ||
                  (status.toLowerCase() === 'pending' && 'bg-clr-yellow') ||
                  (status.toLowerCase() === 'in-premise' && 'bg-clr-tblue') ||
                  (status.toLowerCase() === 'positioned' && 'bg-clr-yellow')
                }
            `}
            >
              <p></p>
            </div>
            <p className='ln-22'>{status}</p>
          </div>
        </Link>
      </td>
    );
  },
};

// ->  Columns for Truck Requests
const TruckRequestsColumns = {
  TruckTypeColumn({ assetClass, url, requestType }) {
    return (
      <td className='RegNoColumn'>
        <Link to={url}>
          <div className='tableItem'>
            <div>
              <p className='ln-22'>
                {requestType
                  ? requestType.toLowerCase() === 'container'
                    ? 'Container'
                    : requestType.toLowerCase() === 'bulk'
                    ? 'Bulk'
                    : assetClass
                  : ''}
              </p>
            </div>
          </div>
        </Link>
      </td>
    );
  },

  RequestTypeColumn({ requestType, url }) {
    return (
      <td className='RequestTypeColumn'>
        <Link to={url}>
          {requestType && <div className={`requestTypeBlock ${requestType.toLowerCase()}`}>{requestType}</div>}
        </Link>
      </td>
    );
  },

  CustomerColumn({ businessUnit, url }) {
    return (
      <td className='CustomerColumn'>
        <Link to={url}>
          <div className='tableItem'>
            <p className='ln-22'>{businessUnit || getDash()}</p>
          </div>
        </Link>
      </td>
    );
  },

  TransporterColumn({ partnerName, url }) {
    return (
      <td className='TransporterColumn'>
        <Link to={url}>
          <div className='tableItem'>
            <p className='ln-22'>{partnerName}</p>
          </div>
        </Link>
      </td>
    );
  },

  PickupAddressColumn({ pickupAddress, url }) {
    return (
      <td className='ActivePartnerColumn'>
        <Link to={url}>
          <div className='tableItem'>
            <p className='mg-btm-4 ln-22'>{pickupAddress}</p>
          </div>
        </Link>
      </td>
    );
  },

  TotalTruckRequestColumn({ requestedQuantity, unallocatedQuantity, requestUnit, allocation = undefined, url }) {
    if (allocation) {
      return (
        <td className='TotalTruckRequestColumn'>
          <div className='tableItem'>
            <p className='totalAll'>
              <span className='requestedQuantity'>{allocation.toString()}</span>
              <span className='requestUnit'>{requestUnit}</span>
            </p>
          </div>
        </td>
      );
    }

    return (
      <td className='TotalTruckRequestColumn'>
        <Link to={url}>
          <div className='tableItem'>
            <p className='total'>
              <span className='requestedQuantity'>{requestedQuantity}</span>
              <span className='requestUnit'>{requestUnit}</span>
            </p>
            <p className='unallocated'>
              <span className='unallocatedQuantity'>{unallocatedQuantity}</span>
              <span className='requestUnit'>{requestUnit}</span>
            </p>
          </div>
        </Link>
      </td>
    );
  },

  ExpiryDateTimeColumn({ expiryDate, time, url }) {
    return (
      <td className='ExpiryDateTimeColumn'>
        <Link to={url}>
          <div className='tableItem'>
            <div className='content'>
              <p className='ln-22 secColor'>{expiryDate}</p>
              <p className='ln-22'>{time}</p>
            </div>
          </div>
        </Link>
      </td>
    );
  },

  AllocationStatusColumn({ status, statusClass }) {
    return (
      <td className='TotalTruckRequestColumn'>
        <div className='tableItem'>
          <p className={`${statusClass}`}>
            <span className='requestedQuantity'>{status}</span>
          </p>
        </div>
      </td>
    );
  },

  StatusColumn({ status, url }) {
    return (
      <td className='StatusColumn'>
        <Link to={url}>
          <div className='tableItem'>
            <div
              className={`tableItemLeft statusHalo 
            ${status.toLowerCase() !== 'open' && 'bg-clr-red'}
            `}
            >
              <p></p>
            </div>
            <p className='ln-22'>{status}</p>
          </div>
        </Link>
      </td>
    );
  },
  ActionColumn({ status, onClone, onEdit, ...data }) {
    return (
      <td className='StatusColumn'>
        <div className='tableItem'>
          <div>
            {status && status.toLowerCase() === 'open' && (
              <>
                <img
                  title='clone truck request'
                  className='pointer'
                  onClick={() => onClone(data)}
                  src={require('../../assets/icons/copy.svg')}
                  alt={'clone '}
                />
                {/*<img*/}
                {/*  title={'edit truck request'}*/}
                {/*  className='margin-left-30 pointer'*/}
                {/*  onClick={() => onEdit(data)}*/}
                {/*  src={require('../../assets/icons/wench.svg')}*/}
                {/*  alt={'edit'}*/}
                {/*/>*/}
              </>
            )}
          </div>
        </div>
      </td>
    );
  },
};

// -> Columns for Transporters
const TransportersColumns = {
  TransporterColumn({ business_name, id, url = '' }) {
    return (
      <td className='TransporterColumn'>
        <Link to={url}>
          <div className='tableItem'>
            <div>
              <p className='mg-btm-4 ln-22'>{business_name}</p>
              <p className='secColor  ln-16'>{id}</p>
            </div>
          </div>
        </Link>
      </td>
    );
  },

  CountryColumn({ country, url = '' }) {
    return (
      <td className='CountryColumn'>
        <Link to={url}>
          <div className='tableItem'>
            <div>
              <p className='mg-btm-4 ln-22'>{country}</p>
            </div>
          </div>
        </Link>
      </td>
    );
  },

  LocationColumn({ location, url = '' }) {
    return (
      <td className='LocationColumn'>
        <Link to={url}>
          <div className='tableItem'>
            <div>
              <p className='mg-btm-4 ln-22'>
                {(location && location.toLowerCase() === 'na' ? getDash() : location) || getDash()}
              </p>
            </div>
          </div>
        </Link>
      </td>
    );
  },

  TrucksColumn({ trucksCount, url = '' }) {
    return (
      <td className='LocationColumn'>
        <Link to={url}>
          <div className='tableItem'>
            <div>
              <p className='mg-btm-4 ln-22'>{trucksCount}</p>
            </div>
          </div>
        </Link>
      </td>
    );
  },

  RatingsColumn({ value, onRateChange }) {
    return (
      <td className='LocationColumn'>
        <div className='tableItem'>
          <div>
            <StarRating {...{ value, onRateChange }} />
          </div>
        </div>
      </td>
    );
  },

  ActionsColumn({ transporterId, setModal, partnerId, user }) {
    const { t } = useTranslation();
    const { businessUnit } = user;
    const isNotAdmin = businessUnit !== 'Admin';
    if (isNotAdmin) return <td className='actionsColumn'>&nbsp;</td>;
    return (
      <td className='actionsColumn'>
        <div className='actionBlock' style={{ padding: 10 }}>
          {transporterId !== partnerId && (
            <button
              className='removeTransporterButton'
              type='button'
              onClick={() =>
                setModal({
                  showModal: true,
                  modalItemId: transporterId,
                  modalType: 'delete',
                })
              }
            >
              <div className='buttonIcon'>
                <img src={RemoveTransporterIcon} alt='remove transporter' />
              </div>
              <div className='buttonText'>
                <>{t('transporters.removeTrans')}</>
              </div>
            </button>
          )}
        </div>
      </td>
    );
  },
};

const AllTransportersTable = {
  TransporterColumn({ business_name, id }) {
    return (
      <td className='TransporterColumn'>
        <div className='tableItem'>
          <div>
            <p className='mg-btm-4 ln-22'>{business_name}</p>
            <p className='secColor  ln-16'>{id}</p>
          </div>
        </div>
      </td>
    );
  },

  CountryColumn({ country }) {
    return (
      <td className='CountryColumn'>
        <div className='tableItem'>
          <div>
            <p className='mg-btm-4 ln-22'>{country}</p>
          </div>
        </div>
      </td>
    );
  },

  LocationColumn({ location }) {
    return (
      <td className='LocationColumn'>
        <div className='tableItem'>
          <div>
            <p className='mg-btm-4 ln-22'>
              {(location && location.toLowerCase() === 'na' ? getDash() : location) || getDash()}
            </p>
          </div>
        </div>
      </td>
    );
  },

  TrucksColumn({ trucksCount }) {
    return (
      <td className='LocationColumn'>
        <div className='tableItem'>
          <div>
            <p className='mg-btm-4 ln-22'>{trucksCount}</p>
          </div>
        </div>
      </td>
    );
  },

  RatingsColumn({ value }) {
    return (
      <td className='LocationColumn'>
        <div className='tableItem'>
          <div>
            <StarRating {...{ value }} />
          </div>
        </div>
      </td>
    );
  },

  DriversColumn({ driversCount }) {
    return (
      <td className='LocationColumn'>
        <div className='tableItem'>
          <div>
            <p className='mg-btm-4 ln-22'>{driversCount}</p>
          </div>
        </div>
      </td>
    );
  },

  ActionsColumn({ transporterId, addTransporterAsync }) {
    const { t } = useTranslation();
    const [buttonText, setButtonText] = React.useState(<>{t('transporters.addTrans')}</>);

    return (
      <td className='actionsColumn'>
        <div className='actionBlock'>
          <button
            className='removeTransporterButton'
            type='button'
            onClick={() => {
              setButtonText(<>{t('transporters.workingOnIt')}</>);
              addTransporterAsync({ transporterId });
            }}
          >
            <div className='buttonIcon'>
              <img src={PlusIcon} alt='add transporter' />
            </div>
            <div className='buttonText'>{buttonText}</div>
          </button>
        </div>
      </td>
    );
  },
};

// Columns for Invoices
const invoicesColumns = {
  IdColumn({ invoiceId, url = '' }) {
    return (
      <td className='tripsTripIdorDateColumn'>
        <Link to={url}>
          <div className='tableItem'>
            <p className='mg-btm-4 ln-22'>{invoiceId || getDash()}</p>
          </div>
        </Link>
      </td>
    );
  },

  AmountColumn({ amount, url = '' }) {
    return (
      <td className=''>
        <Link to={url}>
          <div className='tableItem'>
            <p className='mg-btm-4 ln-22'>{amount || getDash()}</p>
          </div>
        </Link>
      </td>
    );
  },

  AttentionColumn({ attention, url = '' }) {
    return (
      <td>
        <Link to={url}>
          <div className='tableItem'>
            <p className='ln-22'>{attention || getDash()}</p>
          </div>
        </Link>
      </td>
    );
  },

  NoteColumn({ note, url = '' }) {
    return (
      <td>
        <Link to={url}>
          <div className='tableItem'>
            <p className='ln-22'>{note || getDash()}</p>
          </div>
        </Link>
      </td>
    );
  },

  PhoneColumn({ phone, url = '' }) {
    return (
      <td>
        <Link to={url}>
          <div className='tableItem'>
            <p className='ln-22'>{phone || getDash()}</p>
          </div>
        </Link>
      </td>
    );
  },

  TripColumn({ tripCount, url = '' }) {
    return (
      <td>
        <Link to={url}>
          <div className='tableItem'>
            <p className='ln-22'>{tripCount || getDash()}</p>
          </div>
        </Link>
      </td>
    );
  },

  WaybillColumn({ waybillCount, url = '', showWaybill, index }) {
    return (
      <td>
        <Link to={url}>
          {waybillCount < 1 ? (
            <button className='tableItem'>
              <p className='bg-clr-red waybillCount ln-22'>{waybillCount}</p>
            </button>
          ) : (
            <button
              className='tableItem'
              onClick={e => {
                e.preventDefault();
                showWaybill(index);
              }}
            >
              <p className='bg-clr-red waybillCount ln-22'>{waybillCount}</p>
            </button>
          )}
        </Link>
      </td>
    );
  },

  StatusColumn({ status, url = '' }) {
    return (
      <td>
        <Link to={url}>
          <div className='tableItem flex'>
            <div className={`tableItemLeft ${status ? (status !== 'PAID' ? 'statusRedo' : 'statusHalo') : ''} `}>
              <p></p>
            </div>
            <div className='tableItemRight tableItemLastCol ln-16'>
              <p>{status ? (status !== 'PAID' ? 'UNPAID' : 'PAID') : ''}</p>
            </div>
          </div>
        </Link>
      </td>
    );
  },

  DateTrackingColumn({ status, dueDate, url = '' }) {
    return (
      <td>
        <Link to={url}>
          <div className='tableItem'>
            <div
              className={`${
                status !== 'PAID' ? (moment().diff(moment(dueDate)) > 0 ? 'clr-red' : 'clr-green') : 'clr-green'
              }`}
            >
              {status !== 'PAID' ? <p> Due {dueDate ? <Moment fromNow>{dueDate}</Moment> : ''}</p> : 'CLEARED'}
            </div>
          </div>
        </Link>
      </td>
    );
  },
};

// Columns for Pickup Locations
const pickupLocationsColumns = {
  StoreNameColumn({ name }) {
    return (
      <td>
        <div className='tableItem'>
          <p className='ln-22'>{name || getDash()}</p>
        </div>
      </td>
    );
  },

  StoreAddresColumn({ address }) {
    return (
      <td>
        <div className='tableItem'>
          <p className='ln-22'>{address || getDash()}</p>
        </div>
      </td>
    );
  },

  StoreStateColumn({ state }) {
    return (
      <td>
        <div className='tableItem'>
          <p className='secColor ln-22'>{state || getDash()}</p>
        </div>
      </td>
    );
  },

  ContactPersonColumn({ name }) {
    return (
      <td>
        <div className='tableItem'>
          <p className='ln-22'>{name || getDash()}</p>
        </div>
      </td>
    );
  },

  PhoneColumn({ phone }) {
    return (
      <td>
        <div className='tableItem'>
          <p className='ln-22'>{phone || getDash()}</p>
        </div>
      </td>
    );
  },

  ActionsColumn({ pickupLocationId, setModal }) {
    return (
      <td className='actionsColumn'>
        <div className='actionBlock'>
          <button
            title='Edit route'
            className='editBtn padding-unset padding-right--10'
            onClick={() => setModal({ showModal: true, modalType: 'update', modalItemId: pickupLocationId })}
          >
            <img src={wench} alt='edit button' />
          </button>
          <button
            title='Delete route'
            className='deleteBtn padding-unset padding-right--10'
            onClick={() => setModal({ showModal: true, modalType: 'delete', modalItemId: pickupLocationId })}
          >
            <img src={bin} alt='edit button' />
          </button>
        </div>
      </td>
    );
  },
};
//columns for policy requests
const policyRequestColumns = {
  PolicyNumberColumn({ policyNumber, setModal, recipientId }) {
    return (
      <td>
        <div className='tableItem'>
          <p className='ln-22'>
            <button
              type='button'
              onClick={() => setModal({ showModal: true, modalType: crudEnums.READ, modalItemId: recipientId })}
            >
              {policyNumber}
            </button>
          </p>
        </div>
      </td>
    );
  },
  InsuranceTypeColumn({ insuranceType, setModal, recipientId }) {
    return (
      <td>
        <div className='tableItem'>
          <p className='ln-22'>
            <button
              type='button'
              onClick={() => setModal({ showModal: true, modalType: crudEnums.READ, modalItemId: recipientId })}
            >
              {insuranceType}
            </button>
          </p>
        </div>
      </td>
    );
  },
  StatusColumn({ status, setModal, recipientId }) {
    return (
      <td>
        <div className='tableItem'>
          <p className='ln-22'>
            <button
              type='button'
              onClick={() => setModal({ showModal: true, modalType: crudEnums.READ, modalItemId: recipientId })}
            >
              {status}
            </button>
          </p>
        </div>
      </td>
    );
  },
  CompanyKeyColumn({ companyKey, setModal, recipientId }) {
    return (
      <td>
        <div className='tableItem'>
          <p className='ln-22'>
            <button
              type='button'
              onClick={() => setModal({ showModal: true, modalType: crudEnums.READ, modalItemId: recipientId })}
            >
              {companyKey}
            </button>
          </p>
        </div>
      </td>
    );
  },
};

// Columns for Recipients
const recipientsColumns = {
  NameColumn({ name, setModal, recipientId }) {
    return (
      <td>
        <div className='tableItem'>
          <p className='ln-22'>
            <button
              type='button'
              onClick={() => setModal({ showModal: true, modalType: crudEnums.READ, modalItemId: recipientId })}
            >
              {name}
            </button>
          </p>
        </div>
      </td>
    );
  },

  DateAddedColumn({ dateCreated, setModal, recipientId }) {
    return (
      <td className=''>
        <div className='tableItem'>
          <p className='ln-22'>
            <button
              type='button'
              onClick={() => setModal({ showModal: true, modalType: crudEnums.READ, modalItemId: recipientId })}
            >
              {dateCreated || getDash()}
            </button>
          </p>
        </div>
      </td>
    );
  },

  AddressColumn({ address, setModal, recipientId, totalAddress }) {
    return (
      <td>
        <div className='tableItem'>
          <p className='ln-22'>
            <button
              type='button'
              onClick={() => setModal({ showModal: true, modalType: crudEnums.READ, modalItemId: recipientId })}
            >
              {address || getDash()}
              {totalAddress > 1 && <span>{(totalAddress > 1 && `+ ${totalAddress - 1}`) || ''}</span>}
            </button>
          </p>
        </div>
      </td>
    );
  },

  PhoneColumn({ phone, setModal, recipientId }) {
    return (
      <td>
        <div className='tableItem'>
          <p className='ln-22'>
            <button
              type='button'
              onClick={() => setModal({ showModal: true, modalType: crudEnums.READ, modalItemId: recipientId })}
            >
              {phone || getDash()}
            </button>
          </p>
        </div>
      </td>
    );
  },

  ActionsColumn({ recipientId, setModal }) {
    return (
      <td className='actionsColumn'>
        <div className='actionBlock'>
          <button
            title='Edit recipient'
            className='editBtn padding-unset padding-right--10'
            onClick={() => setModal({ showModal: true, modalType: 'update', modalItemId: recipientId })}
          >
            <img src={wench} alt='edit button' />
          </button>
          <button
            title='Delete recipient'
            className='deleteBtn padding-unset padding-right--10'
            onClick={() => setModal({ showModal: true, modalType: 'delete', modalItemId: recipientId })}
          >
            <img src={bin} alt='edit button' />
          </button>
        </div>
      </td>
    );
  },
};

// Columns for Users
const usersColumns = {
  NameColumn({ name, image, first_name, last_name }) {
    return (
      <td>
        <div className='tableItem'>
          {(image && (
            <div className='user-image'>
              <img src={image} alt={name}></img>
            </div>
          )) || <div className='user-image'>{`${first_name[0]}.${last_name[0]}`}</div>}
          {/* </div> */}
          <p className='ln-22'>{name || getDash()}</p>
        </div>
      </td>
    );
  },

  EmailColumn({ email }) {
    return (
      <td>
        <div className='tableItem'>
          <p className='ln-22'>{email || getDash()}</p>
        </div>
      </td>
    );
  },

  PhoneColumn({ phone }) {
    return (
      <td>
        <div className='tableItem'>
          <p className='ln-22'>{phone || getDash()}</p>
        </div>
      </td>
    );
  },

  BusinessColumn({ businessUnit, setModal, userId }) {
    return (
      <td>
        <div className='tableItem'>
          <p className='ln-22'>{businessUnit || getDash()}</p>
        </div>
      </td>
    );
  },

  DateAddedColumn({ dateCreated }) {
    return (
      <td className=''>
        <div className='tableItem'>
          <p className='ln-22'>{dateCreated || getDash()}</p>
        </div>
      </td>
    );
  },

  ActionsColumn({ userId, setModal }) {
    return (
      <td className='actionsColumn'>
        <div className='actionBlock'>
          <button
            title='Edit recipient'
            className='editBtn padding-unset padding-right--10'
            onClick={() => setModal({ showModal: true, modalType: 'update', modalItemId: userId })}
          >
            <img src={wench} alt='edit button' />
          </button>
        </div>
      </td>
    );
  },
};

// Columns for Invoice
const invoiceColumns = {
  TripIdColumn({ tripReadId, url = '' }) {
    return (
      <td className='tripIdColumn'>
        <div className='tableItem'>
          <p className='mg-btm-4 ln-22'>{tripReadId}</p>
        </div>
      </td>
    );
  },

  TransactionDescriptionColumn({ description, url = '' }) {
    return (
      <td className='transactionDescriptionColumn'>
        <div className='tableItem'>
          <p className='mg-btm-4 ln-22'>{description}</p>
        </div>
      </td>
    );
  },

  DeliveryNoteColumn({ deliveryNote, url = '' }) {
    return (
      <td className='ordersIdorDateColumn'>
        <div className='tableItem'>
          <p className='mg-btm-4 ln-22'>{deliveryNote || getDash()}</p>
        </div>
      </td>
    );
  },

  CargoTypeColumn({ goodType, url = '' }) {
    return (
      <td className='ordersIdorDateColumn'>
        <div className='tableItem'>
          <p className='mg-btm-4 ln-22'>{goodType || getDash()}</p>
        </div>
      </td>
    );
  },

  DeliveryPointColumn({ destination, url = '' }) {
    return (
      <td className='ordersIdorDateColumn'>
        <div className='tableItem'>
          <p className='mg-btm-4 ln-22'>{destination}</p>
        </div>
      </td>
    );
  },

  AmountColumn({ amount, url = '' }) {
    return (
      <td className='amountColumn'>
        <div className='tableItem'>
          <p className='mg-btm-4 ln-22'>{amount}</p>
        </div>
      </td>
    );
  },

  WaybillsColumn({ waybillImage, showWaybill, url = '' }) {
    const total = waybillImage.filter(
      w =>
        w.length !== 0 &&
        (w.tripStatus.toLowerCase() === 'at-destination' || w.tripStatus.toLowerCase() === 'delivered'),
    );
    const spliced = waybillImage
      .filter(
        w =>
          w.length !== 0 &&
          (w.tripStatus.toLowerCase() === 'at-destination' || w.tripStatus.toLowerCase() === 'delivered'),
      )
      .splice(0, 3);
    const remainder = total.length - spliced.length;
    return (
      <td className='waybillsColumn'>
        <div className='tableItem'>
          {spliced.map((image, index) => {
            return (
              <img
                key={uuid()}
                className='mg-btm-4 ln-22 waybill-image'
                src={`${image.path}`}
                alt={image.path}
                onClick={() => showWaybill(index)}
              />
            );
          })}
          {remainder > 0 && <span className='remainder'>&#43; {remainder}</span>}
        </div>
      </td>
    );
  },
};

const CSVStatusColumns = {
  FileNameColumn({ fileName, url }) {
    return (
      <td className='FileNameColumn'>
        <div className='tableItem'>
          <a className='ln-22 clr-blue fnt-wt-bold' href={url} download>
            {fileName}
          </a>
        </div>
      </td>
    );
  },

  TotalRouteColumn({ total }) {
    return (
      <td className='TotalRouteColumn'>
        <div className='tableItem'>
          <p className='ln-22'>{total}</p>
        </div>
      </td>
    );
  },

  SuccessfulColumn({ noSuccess }) {
    return (
      <td className='SuccessfulColumn'>
        <div className='tableItem'>
          <p className='ln-22'>{noSuccess}</p>
        </div>
      </td>
    );
  },

  ErrorColumn({ noError }) {
    return (
      <td className='ErrorColumn'>
        <div className='tableItem'>
          <p className='ln-22'>{noError}</p>
        </div>
      </td>
    );
  },

  StatusColumn({ status }) {
    return (
      <td className='ErrorColumn'>
        <div className='tableItem'>
          <div className='tableItemLeft statusHalo'>
            <p></p>
          </div>
          <p className='ln-22'>{status}</p>
        </div>
      </td>
    );
  },
};

const SupportColumns = {
  FromColumn({ from }) {
    return (
      <td className='FileNameColumn'>
        <div className='tableItem'>
          <p className='ln-22 clr-blue fnt-wt-bold'>{from || 'N/A'}</p>
        </div>
      </td>
    );
  },

  ReadColumn({ read }) {
    console.log('read in column', read);
    return (
      <td className='FileNameColumn'>
        <div className='tableItem'>
          <p className='ln-22 clr-blue fnt-wt-bold'>{!read ? 'unread' : 'read'}</p>
        </div>
      </td>
    );
  },
  ResolvedColumn({ resolved }) {
    return (
      <td className='FileNameColumn'>
        <div className='tableItem'>
          <p className='ln-22 clr-blue fnt-wt-bold'>{resolved === false ? 'pending' : 'resolved'}</p>
        </div>
      </td>
    );
  },

  SubjectColumn({ message }) {
    return (
      <td className='TotalRouteColumn'>
        <div className='tableItem'>
          <p className='ln-22'>{message}</p>
        </div>
      </td>
    );
  },

  DateColumn({ date }) {
    return (
      <td className='SuccessfulColumn'>
        <div className='tableItem'>
          <p className='ln-22'>{<Moment date={date} format='DD-MM-YYYY hh:mm A' />}</p>
        </div>
      </td>
    );
  },

  TypeColumn({ messageType }) {
    return (
      <td className='ErrorColumn'>
        <div className='tableItem'>
          <p className='ln-22'>{messageType}</p>
        </div>
      </td>
    );
  },
};

const CustomerRoutesColumns = {
  RouteID({ id }) {
    return (
      <td className='RouteID'>
        <div className='tableItem'>
          <p className='ln-22'>{id}</p>
        </div>
      </td>
    );
  },
  Pickup({ pickupAddress }) {
    return (
      <td className='tripsTripIdorDateColumn'>
        <div className='tableItem'>
          <p className='ln-22'>{pickupAddress}</p>
        </div>
      </td>
    );
  },
  Destination({ destinationAddress }) {
    return (
      <td className='tripsTripIdorDateColumn'>
        <div className='tableItem'>
          <p className='ln-22'>{destinationAddress}</p>
        </div>
      </td>
    );
  },
  Price({ price }) {
    return (
      <td className='tripsTripIdorDateColumn'>
        <div className='tableItem'>
          <p className='ln-22'>{price}</p>
        </div>
      </td>
    );
  },
  Asset({ asset }) {
    return (
      <td className='tripsTripIdorDateColumn'>
        <div className='tableItem'>
          <p className='ln-22'>{asset}</p>
        </div>
      </td>
    );
  },
};

// Columns for Drivers
const DriversColumns = {
  DriverIdColumn({ id, date, url = '' }) {
    return (
      <td className='tripsTripIdorDateColumn'>
        <Link to={url}>
          <div className='tableItem'>
            <p className='mg-btm-4 ln-22'>{id || getDash()}</p>
            <small className='mg-btm-4 ln-22'>{date}</small>
          </div>
        </Link>
      </td>
    );
  },
  DriverNameColumn({ name, url = '' }) {
    return (
      <td className='tripsTripIdorDateColumn'>
        <Link to={url}>
          <div className='tableItem'>
            <p className='mg-btm-4 ln-22'>{name || getDash()}</p>
          </div>
        </Link>
      </td>
    );
  },

  partnerColumn({ partner, url = '' }) {
    return (
      <td className=''>
        <Link to={url}>
          <div className='tableItem'>
            <p className='mg-btm-4 ln-22'>{partner || getDash()}</p>
          </div>
        </Link>
      </td>
    );
  },

  assignedTruckColumn({ assignedTruck, url = '' }) {
    return (
      <td>
        <Link to={url}>
          <div className='tableItem'>
            <p className='ln-22'>{assignedTruck || getDash()}</p>
          </div>
        </Link>
      </td>
    );
  },

  RateColumn({ rate, url = '' }) {
    return (
      <td>
        <Link to={url}>
          <div className='tableItem'>
            <StarRating {...{ value: rate }} />
          </div>
        </Link>
      </td>
    );
  },

  // StatusColumn({ status, url = '' }) {
  //   return (
  //     <td>
  //       <Link to={url}>
  //         <div className='tableItem flex'>
  //           <div className={`tableItemLeft ${status ? (status !== 1 ? 'statusRedo' : 'statusHalo') : ''} `}>
  //             <p></p>
  //           </div>
  //           <div className='tableItemRight tableItemLastCol ln-16'>
  //             <p>{status ? (status === 1 ? 'ACTIVE' : 'INACTIVE') : ''}</p>
  //           </div>
  //         </div>
  //       </Link>
  //     </td>
  //   );
  // },
};

// Columns for Trucks
const TrucksColumns = {
  RegNoColumn({ regNumber, url = '' }) {
    return (
      <td className='tripsTripIdorDateColumn'>
        <Link to={url}>
          <div className='tableItem'>
            <p className='mg-btm-4 ln-22'>{regNumber || getDash()}</p>
          </div>
        </Link>
      </td>
    );
  },

  ActivePartnerColumn({ ownerBusinessName, ownerId, url = '' }) {
    return (
      <td className=''>
        <Link to={url}>
          <div className='tableItem' style={{ display: 'block' }}>
            <p className='mg-btm-4 ln-22'>{ownerBusinessName || getDash()}</p>
            <p className='secColor ln-16'>{ownerId || getDash()}</p>
          </div>
        </Link>
      </td>
    );
  },

  TruckTypeColumn({ truckType, url = '' }) {
    return (
      <td>
        <Link to={url}>
          <div className='tableItem'>
            <p className='ln-22'>{truckType || getDash()}</p>
          </div>
        </Link>
      </td>
    );
  },

  ModelColumn({ model, url = '' }) {
    return (
      <td>
        <Link to={url}>
          <div className='tableItem'>
            <p className='ln-22'>{model || getDash()}</p>
          </div>
        </Link>
      </td>
    );
  },

  AssignedDriverColumn({ currentDriver, url = '' }) {
    return (
      <td>
        <Link to={url}>
          <div className='tableItem' style={{ flexDirection: 'column' }}>
            {(currentDriver && (
              <div>
                <p className='ln-22'>{currentDriver.name || getDash()}</p>
                <p className=' secColor ln-16'>{currentDriver.mobile || getDash()}</p>
              </div>
            )) ||
              getDash()}
          </div>
        </Link>
      </td>
    );
  },

  AssignedDriverPoolColumn({ currentDriver, url = '' }) {
    return (
      <td>
        <Link to={url}>
          <div className='tableItem' style={{ flexDirection: 'column' }}>
            {currentDriver ? (
              <div>
                <p className='ln-22'>{currentDriver.name || getDash()}</p>
                <p className='ln-22'>{currentDriver.mobile || getDash()}</p>
                <p className='ln-22'>
                  Date added: <Moment date={currentDriver.dateAssigned} format='DD-MM-YYYY' />
                </p>
              </div>
            ) : (
              ''
            )}
          </div>
        </Link>
      </td>
    );
  },

  StatusColumn({ active, url = '' }) {
    return (
      <td>
        <Link>
          <div className='tableItem flex'>
            <div className={`tableItemLeft ${active ? 'statusHalo' : 'statusAvailable'} `}>
              <p></p>
            </div>
            <div className='tableItemRight tableItemLastCol ln-16'>
              <p>{active ? 'ACTIVE' : 'AVAILABLE'}</p>
            </div>
          </div>
        </Link>
      </td>
    );
  },
};

export {
  tripsColumns,
  ordersColumns,
  routesColumns,
  TruckPoolsColumns,
  TruckRequestsColumns,
  invoicesColumns,
  pickupLocationsColumns,
  recipientsColumns,
  invoiceColumns,
  CSVStatusColumns,
  usersColumns,
  SupportColumns,
  TransportersColumns,
  AllTransportersTable,
  CustomerRoutesColumns,
  DriversColumns,
  TrucksColumns,
  policyRequestColumns,
};
