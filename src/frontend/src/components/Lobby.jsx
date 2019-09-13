import React from 'react';
import { useSelector } from 'react-redux';

import '../styles/lobby.scss';

const Lobby = () => {
  const statePlayer = useSelector(state => state.player);

  return (
    <div className="text-centre top-margin">
      <h1>Lobby</h1>
      <p>Game Code: <span className="code">{statePlayer.game}</span></p>

      <hr />

      <p>Nice</p>
    </div>
  );
};

export default Lobby;
