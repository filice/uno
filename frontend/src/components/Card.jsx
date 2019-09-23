import React from 'react';

import '../styles/card.scss';

const Card = ({ type, colour }) => {
  const typeMapping = {
    'zero': '0',
    'one': '1',
    'two': '2',
    'three': '3',
    'four': '4',
    'five': '5',
    'six': '6',
    'seven': '7',
    'eight': '8',
    'nine': '9',
    'skip': '❌',
    'reverse': '↩️',
    '+2': '+2',
    'wild': '🏳️‍🌈',
    '+4': '+4',
  };

  return (
    <div className="card">
      <div className="card-content">
        {colour &&
          <><span className={`colour ${colour}`}></span>&nbsp;</>
        }
        <span>{typeMapping[type]}</span>
      </div>
    </div>
  );
};

export default Card;
