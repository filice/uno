import React, { useEffect } from 'react';
import { replace } from 'connected-react-router';
import { useDispatch, useSelector } from 'react-redux';

import '../styles/lobby.scss';

const Lobby = () => {
  const statePlayer = useSelector(state => state.player);
  const stateGame = useSelector(state => state.game);
  const dispatch = useDispatch();

  // Go back to menu if game not loaded
  useEffect(() => {
    if (statePlayer.game === -1) {
      dispatch(replace('/menu'));
    }
  }, []);

  return (
    <div className="text-centre top-margin">
      <h1>Lobby</h1>
      <p>Game Code: <span className="code">{statePlayer.game}</span></p>

      <hr />

      <h5>Players</h5>

      <ul>
        {stateGame.players.map(player => (
          <li key={player.uuid}>{player.name}</li>
        ))}
      </ul>

      <hr />

      <button>Start Game</button>
    </div>
  );
};

export default Lobby;
