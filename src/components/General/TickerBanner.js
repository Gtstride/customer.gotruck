import React from 'react';
import { formatPrice } from '../../_utils/fx';

function TickerBanner({ isLoading, routes, index }) {
  if (isLoading) {
    return <p className='loading'>Loading routes...</p>;
  }
  return (
    routes.length > 0 && (
      <div className='ticker'>
        {routes.slice(index, 100).map(({ source, destination, average, currency }, i) => {
          return (
            <div key={i} className='ticker__item'>{`${source} to ${destination} - ${currency}${formatPrice(
              average,
            )}`}</div>
          );
        })}
      </div>
    )
  );
}

export default TickerBanner;
