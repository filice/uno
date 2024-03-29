import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { replace } from 'connected-react-router';
import { useDispatch, useSelector } from 'react-redux';

import '../styles/lobby.scss';
import { sendStartGame } from '../socket';

const Lobby = () => {
  const [error, setError] = useState('');
  const [gameStarting, setGameStarting] = useState(false);

  const statePlayer = useSelector(state => state.player);
  const stateGame = useSelector(state => state.game);
  const dispatch = useDispatch();

  // Go back to menu if game not loaded
  useEffect(() => {
    if (!statePlayer.game) {
      dispatch(replace('/menu'));
    }
  }, []);
  // Set local game starting
  useEffect(() => {
    setGameStarting(stateGame.starting);
  }, [stateGame]);

  const startGameClicked = () => {
    if (stateGame.players.length < 2) {
      return setError('At least 2 players required to start.');
    }

    setError('');

    sendStartGame();
  };

  const renderPlayerList = () => {
    if (stateGame.players.length === 0) {
      return <p>Loading...</p>;
    }

    return (
      <ul>
        {stateGame.players.map(player => (
          <li className="player" key={player.uuid}>
            {player.name}
            {player.uuid === statePlayer.uuid && ' (you)'}
          </li>
        ))}
      </ul>
    );
  }

  const renderSubmit = () => {
    if (gameStarting) {
      return <p>Game starting...</p>;
    }

    let render = [];

    render.push(<button key="start" onClick={startGameClicked}>
      Start Game
    </button>);

    if (error) {
      render.push(<p className="error" key="error">{error}</p>);
    }

    return <>{render}</>;
  };

  return (
    <div className="text-centre top-margin">
      <Link to='/menu'>back to menu</Link>
      <h1>Lobby</h1>
     <p>Uno Game Code: <a href={"https://wa.me/?text=Share%20the%20game%20code%20with%20your%20friends%2C%20Game%20code%3A%0A%0A" + statePlayer.game}><span className="code">{statePlayer.game}</span></a> Click To Share</p>

      <hr />

      <h5 id="players">Players</h5>

      { renderPlayerList() }

      <hr />

      { renderSubmit() }
    </div>
  );
};

export default Lobby;
