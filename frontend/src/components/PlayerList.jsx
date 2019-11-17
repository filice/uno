import React from 'react';
import { useSelector } from 'react-redux';

import '../styles/playerList.scss';

const PlayerList = () => {
  const stateGame = useSelector(state => state.game);
  const statePlayer = useSelector(state => state.player);

  const getCurrentClass = uuid => (
    uuid === stateGame.curTurn ? 'current' : ''
  );

  return (
    <div id="players">
      <ul>
        {stateGame.players.map(player => (
          <li key={player.uuid}
              className={getCurrentClass(player.uuid)}
          >
            <span className="name">
              {player.name}
              {player.uuid === statePlayer.uuid && ' (you)'}
            </span>
            <span className="cards">
              {stateGame.playerHands &&
                  stateGame.playerHands[player.uuid] +
                  (stateGame.playerHands[player.uuid] === 1 ?
                    ' card' : ' cards')}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PlayerList;
