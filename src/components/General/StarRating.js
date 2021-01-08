import React, { useState } from 'react';
import PropTypes from 'prop-types';

function Star({ marked, starId }) {
  return (
    <span star-id={starId} style={{ color: '#ff9933' }} role='button'>
      {marked ? '\u2605' : '\u2606'}
    </span>
  );
}

function StarRating({ value, onRateChange }) {
  const [rating, setRating] = useState(value !== null ? (typeof value == 'number' ? value : 0) : 0);
  const [selection, setSelection] = useState(0);
  const hoverOver = event => {
    let val = 0;
    if (event && event.target && event.target.getAttribute('star-id')) val = event.target.getAttribute('star-id');
    setSelection(val);
  };
  return (
    <div
      onMouseOut={false ? () => hoverOver(null) : () => {}}
      onClick={e => {
        onRateChange(e.target.getAttribute('star-id'));
        setRating(e.target.getAttribute('star-id') || rating);
      }}
      onMouseOver={false ? hoverOver(null) : () => {}}
    >
      {Array.from({ length: 5 }, (v, i) => (
        <Star starId={i + 1} key={`star_${i + 1} `} marked={selection ? selection >= i + 1 : rating >= i + 1} />
      ))}
    </div>
  );
}

StarRating.propTypes = {
  value: PropTypes.number.isRequired,
};

export default StarRating;
