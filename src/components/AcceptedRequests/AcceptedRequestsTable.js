import { format } from 'date-fns';
import React from 'react';
import { Link } from 'react-router-dom';
import { uuid } from '../../_utils/fx';

function AcceptedRequestsTable({ acceptedRequests, page, partnerId }) {
  return acceptedRequests.map(acceptedRequest => {
    const url = `/${partnerId}/${page}/${acceptedRequest._id}`;
    const { partner, acceptedPartner, acceptedQuantity } = acceptedRequest;
    // TODO: Abstract this as an utility function and refactor too
    let request;

    if (partner) {
      if (partner.id === +partnerId) {
        const accepted = acceptedPartner.find(p => p.id === +partnerId);
        request = { requestedQuantity: (accepted && accepted.fulfilled) || 0, acceptedQuantity };
      } else {
        if (acceptedPartner.some(p => p.id === +partnerId)) {
          const partner = acceptedPartner.find(p => p.id === +partnerId);
          request = { requestedQuantity: partner.fulfilled, acceptedQuantity: partner.allocated };
        } else {
          const partner = acceptedPartner.flatMap(p => p.allocatedPartner).find(p => p.id === +partnerId);
          request = {
            requestedQuantity: (partner && partner.fulfilled) || 0,
            acceptedQuantity: (partner && partner.quantity) || 0,
          };
        }
      }
    } else {
      if (acceptedPartner.find(p => p.id === +partnerId)) {
        const partner = acceptedPartner.find(p => p.id === +partnerId);
        request = { requestedQuantity: partner.fulfilled, acceptedQuantity: partner.quantity };
      } else {
        const partner = acceptedPartner.flatMap(p => p.allocatedPartner).find(p => p.id === +partnerId);
        request = {
          requestedQuantity: (partner && partner.fulfilled) || 0,
          acceptedQuantity: (partner && partner.quantity) || 0,
        };
      }
    }
    // console.log(request)
    return (
      <tr key={uuid()}>
        <td className=''>
          <Link to={url}>
            <div className='tableItem'>
              <p className='mg-btm-4 ln-22'>
                {(acceptedRequest.asset &&
                  `${acceptedRequest.asset.size} ${acceptedRequest.asset.unit} ${acceptedRequest.asset.type}`) ||
                  (acceptedRequest.requestType.toLowerCase() === 'container' && 'Container') ||
                  'Bulk'}
              </p>
            </div>
          </Link>
        </td>

        <td className='RequestTypeColumn'>
          <Link to={url}>
            <div className='tableItem'>
              <p className='mg-btm-4 ln-22' style={{ marginRight: '10px' }}>
                {(acceptedRequest.customerName && acceptedRequest.customerName) || 'N/A'}
              </p>
            </div>
            {acceptedRequest.requestType && (
              <div
                style={{ marginRight: '10px' }}
                className={`requestTypeBlock ${acceptedRequest.requestType.toLowerCase()}`}
              >
                {acceptedRequest.requestType || 'N/A'}
              </div>
            )}
          </Link>
        </td>

        <td className=''>
          <Link to={url}>
            <div className='tableItem'>
              <p className='mg-btm-4 ln-22'>
                {(acceptedRequest.pickupStation && acceptedRequest.pickupStation.address) || 'N/A'}
              </p>
            </div>
          </Link>
        </td>

        <td className='TotalTruckRequestColumn'>
          <Link to={url}>
            <div className='tableItem' style={{ display: 'flex', alignItems: 'center', flex: '1' }}>
              <p className='total'>
                <span className='requestedQuantity'>{request.acceptedQuantity}</span>
                <span className='requestUnit'>
                  {acceptedRequest.requestType
                    ? (acceptedRequest.requestType.toLowerCase() === 'bulk' && 'Mtons') || 'trucks'
                    : ''}
                </span>
              </p>
              <p className='unallocated'>
                <span className='unallocatedQuantity'>
                  {/* {isNaN(request.requestedQuantity - request.acceptedQuantity)
                    ? 
                    : request.requestedQuantity - request.acceptedQuantity} */}
                  {(request.acceptedQuantity - request.requestedQuantity > 0 &&
                    request.acceptedQuantity - request.requestedQuantity) ||
                    0}
                </span>
                <span className='requestUnit'>
                  {acceptedRequest.requestType
                    ? (acceptedRequest.requestType.toLowerCase() === 'bulk' && 'Mtons') || 'trucks'
                    : ''}
                </span>
              </p>
            </div>
          </Link>
        </td>

        <td className=''>
          <Link to={url}>
            <div className='tableItem'>
              <p className='mg-btm-4 ln-22'>
                {(acceptedRequest.expiryDate &&
                  format(new Date(acceptedRequest.expiryDate), 'MMMM d, yyyy hh:mm aaa')) ||
                  'N/A'}
              </p>
            </div>
          </Link>
        </td>

        <td className=''>
          <Link to={url}>
            <div className='tableItem' style={{ display: 'flex', alignItems: 'center' }}>
              <div className={`${acceptedRequest.status}`} style={{ marginRight: '10px' }}></div>
              <p className='ln-22' style={{ textTransform: 'capitalize', marginRight: '10px' }}>
                {acceptedRequest.status || 'N/A'}
              </p>
            </div>
          </Link>
        </td>
      </tr>
    );
  });
}

export default AcceptedRequestsTable;
