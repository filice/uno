import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { canPlay, sortHand } from '../../../shared';
import Card from './Card';
import '../styles/hand.scss';

const Hand = ({
  discardTop,
  myTurn,
  showChooseColourModal,
}) => {
  const [sortedHand, setSortedHand] = useState([]);

  const stateHand = useSelector(state => state.player.hand);

  // Sort hand
  useEffect(() => {
    setSortedHand(sortHand(stateHand));
  }, [stateHand]);

  return (
    <div id="hand">
      {sortedHand.map((card, i) => (
        <Card key={i}
              type={card.type}
              colour={card.colour}
              enabled={myTurn && canPlay(card, discardTop)}
              inHand={true}
              showChooseColourModal={showChooseColourModal}
        />
      ))}
    </div>
  );
};

export default Hand;
