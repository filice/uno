import React from 'react';

import '../styles/card.scss';
import { playCard } from '../socket.js';

const Card = ({
  type,
  colour,
  enabled = false,
  inHand = false,
  showChooseColourModal,
  hideChooseColourModal,
}) => {
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
    'blank': '',
  };

  const cardClicked = () => {
    if (!enabled || !inHand) return;

    if (!colour) {
      showChooseColourModal(type);
    } else {
      playCard({ type, colour });
      hideChooseColourModal();
    }
  };

  const cardClasses = (!enabled ? ' disabled': '') +
                      (inHand ? ' hand' : '');

  return (
    <div className={ `card ${cardClasses}` } onClick={cardClicked} >
      <div className="card-content">
        {colour &&
          <><span className={`colour ${cardClasses} ${colour}`}></span>&nbsp;</>
        }
        <span className={`number`}>{typeMapping[type]}</span>
      </div>
    </div>
  );
};

export default Card;
