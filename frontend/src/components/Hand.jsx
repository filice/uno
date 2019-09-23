import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import Card from './Card';
import '../styles/hand.scss';

const Hand = () => {
  const [sortedHand, setSortedHand] = useState([]);

  const stateHand = useSelector(state => state.player.hand);

  // Sort hand
  useEffect(() => {
    console.log(stateHand);
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
        <Card key={i} type={card.type} colour={card.colour} />
      ))}
    </div>
  );
};

export default Hand;
