import React from 'react';
import { useSelector } from 'react-redux';

import Card from './Card';

const Hand = () => {
  const stateHand = useSelector(state => state.player.hand);

  return (
    <div>
      {stateHand.map((card, i) => (
        <Card key={i} type={card.type} colour={card.colour} />
      ))}
    </div>
  );
};

export default Hand;
