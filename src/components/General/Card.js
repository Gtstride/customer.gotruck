import PropTypes from 'prop-types';
import React from 'react';
import { AnalyticsCardStyle } from '../../styles/General/AnalyticCardStyles';
import NewCardStyle from '../../styles/NewCardStyle';
import { cardTypes } from '../../_utils/constants';
import { getDash } from '../../_utils/fx';
import CardFrequencyLoader from '../Loaders/CardFrequencyLoader';
import { getObjectProp } from '../../_utils/fx';

function AnalyticsCard({
  promises: {
    analyticsPromises: { response, isLoading, error },
  },
  cardDisplayParams: { cardType, cardTitle, cardText },
  styles: { color, icon },
}) {
  // #region Functions
  // Each card type has its value deeply nested
  function resolveCardTotalValue() {
    console.log('response', response);
    switch (cardType) {
      case cardTypes.TRIP:
        return getObjectProp(['trip', 'total', 'total'], response) || getDash();
      case cardTypes.REQUEST:
        return getObjectProp(['request', 'total', 'total'], response) || getDash();
      case cardTypes.TRANSPORTER:
        return cardText ? cardText : getDash();
      default:
        return 0;
    }
  }
  // #endregion

  // #region Renders
  if (isLoading) {
    return (
      <AnalyticsCardStyle {...{ color, icon }}>
        <div className='cardIconBlock'></div>
        <div className='cardInfoBlock'>
          <p className='cardTitle'>{cardTitle}</p>
          <CardFrequencyLoader />
        </div>
      </AnalyticsCardStyle>
    );
  }

  if (error) {
    return (
      <AnalyticsCardStyle {...{ color, icon }}>
        <div className='cardIconBlock'></div>
        <div className='cardInfoBlock'>
          <p className='cardTitle'>{cardTitle}</p>
          <p className='cardTotal'>{getDash()}</p>
        </div>
      </AnalyticsCardStyle>
    );
  }

  if (cardType === 'noOfDrivers' || cardType === 'noOfTrips') {
    return (
      <AnalyticsCardStyle {...{ color, icon }}>
        <div className='cardIconBlock'></div>
        <div className='cardInfoBlock'>
          <p className='cardTitle'>{cardTitle}</p>
          <p className='cardTotal'>{response}</p>
        </div>
      </AnalyticsCardStyle>
    );
  }

  return (
    <AnalyticsCardStyle {...{ color, icon }}>
      <div className='cardIconBlock'></div>
      <div className='cardInfoBlock'>
        <p className='cardTitle'>{cardTitle}</p>
        <p className='cardTotal'>{resolveCardTotalValue()}</p>
      </div>
    </AnalyticsCardStyle>
  );
  // #endregion
}

function Card({ page, type, label, currency, total = undefined, totalInv = undefined, filter, totalVal, toPage }) {
  function formatDigit(digit, type) {
    if (type && type.toLowerCase() === 'reliabilityIndex') {
      return `${digit}%`;
    }
    return digit.toLocaleString();
  }

  function reconcileTotal() {
    if (total === 0 || !total) {
      return 0;
    }
    return formatDigit(total);
  }

  if (total === 0) {
    return (
      <NewCardStyle>
        <div id={page} className={`card ${type}`}>
          <div className='cardIconBlock bd-rad-5' data-align='center-both'></div>
          <div className='cardInfoBlock'>
            <p className='cardLabel fnt-sz-14'>{label}</p>
            <div className='cardFrequency fnt-sz-16'>
              {currency} {total}
            </div>
          </div>
        </div>
      </NewCardStyle>
    );
  }

  if (totalInv) {
    return (
      <NewCardStyle>
        <div id={page} className={`card ${type}`}>
          <div className='cardIconBlock bd-rad-5' data-align='center-both'></div>
          <div className='cardInfoBlock'>
            <p className='cardLabel fnt-sz-14'>{label}</p>
            <div className='cardFrequency fnt-sz-16'>{totalInv}</div>
          </div>
        </div>
      </NewCardStyle>
    );
  }

  if (totalVal) {
    return (
      <NewCardStyle>
        <div id={page} className={`card ${type} pointer`} onClick={() => toPage(type)}>
          <div className='cardIconBlock bd-rad-5' data-align='center-both'></div>
          <div className='cardInfoBlock'>
            <p className='cardLabel fnt-sz-14'>{label}</p>
            <div className='cardFrequency fnt-sz-16'>{totalVal}</div>
          </div>
        </div>
      </NewCardStyle>
    );
  }

  if (!total) {
    return (
      <NewCardStyle>
        <div id={page} className={`card ${type}`}>
          <div className='cardIconBlock bd-rad-5' data-align='center-both'></div>
          <div className='cardInfoBlock'>
            <p className='cardLabel fnt-sz-14'>{label}</p>
            <div className='cardFrequency fnt-sz-16'>{getDash()}</div>
          </div>
        </div>
      </NewCardStyle>
    );
  }

  if (filter !== undefined) {
    return (
      <NewCardStyle>
        <div id={page} className={`card ${type}`}>
          <div className='cardIconBlock bd-rad-5' data-align='center-both'></div>
          <div className='cardInfoBlock'>
            <p className='cardLabel fnt-sz-14'>{label}</p>
            <p className='cardFrequency fnt-sz-16'>
              {currency} {reconcileTotal()}
            </p>
          </div>
        </div>
        {/* </Link> */}
      </NewCardStyle>
    );
  }

  return (
    <NewCardStyle>
      <div id={page} className={`card ${type}`}>
        <div className='cardIconBlock bd-rad-5' data-align='center-both'></div>
        <div className='cardInfoBlock'>
          <p className='cardLabel fnt-sz-14'>{label}</p>
          <p className='cardFrequency fnt-sz-16'>
            {currency} {reconcileTotal()}
          </p>
        </div>
      </div>
    </NewCardStyle>
  );
}

Card.propTypes = {
  frequency: PropTypes.number,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  type: PropTypes.string,
};

AnalyticsCard.propTypes = {
  promises: PropTypes.shape({
    analyticsPromises: PropTypes.shape({
      response: PropTypes.object,
      isLoading: PropTypes.bool,
      error: PropTypes.string,
    }),
  }),
  cardDisplayParams: PropTypes.shape({
    cardType: PropTypes.oneOf(Object.values(cardTypes)),
    cardTitle: PropTypes.oneOf([PropTypes.string, PropTypes.object, PropTypes.any]),
  }),
  styles: PropTypes.shape({
    color: PropTypes.string,
    icon: PropTypes.string,
  }),
};

export default Card;
export { Card, AnalyticsCard };
