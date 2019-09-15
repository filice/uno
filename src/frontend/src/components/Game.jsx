import React, { useEffect } from 'react';
import { replace } from 'connected-react-router';
import { useDispatch, useSelector } from 'react-redux';

import '../styles/game.scss';

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

  const renderGame = () => {
    if (!stateGame.curColour || !stateGame.discardTop) {
      return <p>Loading...</p>;
    };

    return (
      <>
        <p>Colour: {stateGame.curColour}</p>
        <p>
          Top:&nbsp;
          {stateGame.discardTop.colour}&nbsp;
          {stateGame.discardTop.type}
        </p>
      </>
    );
  };

  const renderPlayer = () => {
    if (!statePlayer.hand) {
      return <p>Loading...</p>;
    }

    return (
      <ul>
        {statePlayer.hand.map((card, i) => (
          <li key={i}>{card.colour} {card.type}</li>
        ))}
      </ul>
    );
  };

  return (
    <div className="text-centre top-margin">
      {renderTurnIndicator()}

      <hr />

      {renderGame()}

      <hr />

      {renderPlayer()}
    </div>
  );
};

export default Game;
