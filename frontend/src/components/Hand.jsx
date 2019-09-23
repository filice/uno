import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { canPlay } from '../../../shared/hand.js';
import Card from './Card';
import '../styles/hand.scss';

const Hand = ({ discardTop }) => {
  const [sortedHand, setSortedHand] = useState([]);

  const stateHand = useSelector(state => state.player.hand);

  // Sort hand
  useEffect(() => {
    setSortedHand(
      stateHand
        .slice(0)
        .sort((a, b) => {
          if (!a.colour) return -1;
          if (!b.colour) return 1;

          return a.colour.localeCompare(b.colour);
        })
    );
  }, [stateHand]);

  return (
    <div id="hand">
      {sortedHand.map((card, i) => (
        <Card key={i}
              type={card.type}
              colour={card.colour}
              enabled={canPlay(card, discardTop)}
              inHand={true}
        />
      ))}
    </div>
  );
};

export default Hand;
