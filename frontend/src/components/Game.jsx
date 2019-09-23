import React, { useEffect } from 'react';
import { replace } from 'connected-react-router';
import { useDispatch, useSelector } from 'react-redux';

import '../styles/game.scss';
import Card from './Card';
import Hand from './Hand';

const Game = () => {
  const stateGame = useSelector(state => state.game);
  const statePlayer = useSelector(state => state.player);
  const dispatch = useDispatch();

  // Go back to menu if game not loaded
  useEffect(() => {
    if (!stateGame.started) {
      dispatch(replace('/menu'));
    }
  }, []);

  const renderTurnIndicator = () => {
    if (!stateGame.curTurn || !stateGame.players) {
      return <h4 id="turnIndicator">Loading...</h4>;
    }

    if (stateGame.curTurn === statePlayer.uuid) {
      return (
        <h4 id="turnIndicator">It's your turn!</h4>
      );
    } else {
      // Find current player name
      for (const player of stateGame.players) {
        if (player.uuid === stateGame.curTurn) {
          return (
            <h4 id="turnIndicator">It's&nbsp;
              <span id="curPlayer">{player.name}</span>'s
            turn!</h4>
          );
        }
      }
    }
  };

  const renderDiscard = () => {
    if (!stateGame.discardTop) {
      return <p>Loading...</p>;
    };

    return  (
      <div id="discard-top">
        <Card
          type={stateGame.discardTop.type}
          colour={stateGame.discardTop.colour}
          enabled={false}
          inHand={false}
        />
      </div>
    );
  };

  const renderPlayers = () => (
    <div id="players">
      <h5>Players</h5>
      <ul>
        {stateGame.players.map(player => (
          <li
            key={player.uuid}
            className={player.uuid === stateGame.curTurn ? 'current' : ''}
          >
            {player.name}
            {player.uuid === statePlayer.uuid && ' (you)'}
          </li>
        ))}
      </ul>
    </div>
  );

  const renderGame = () => (
    <>
      {renderDiscard()}
      {renderPlayers()}
    </>
  );

  const renderHand = () => {
    if (!statePlayer.hand) {
      return <p>Loading...</p>;
    }

    return <Hand discardTop={stateGame.discardTop} />;
  };

  return (
    <div className="text-centre top-margin">
      {renderTurnIndicator()}

      <hr />

      {renderGame()}

      <hr />

      {renderHand()}
    </div>
  );
};

export default Game;
