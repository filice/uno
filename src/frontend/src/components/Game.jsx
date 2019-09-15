import React, { useEffect } from 'react';
import { replace } from 'connected-react-router';
import { useDispatch, useSelector } from 'react-redux';

import '../styles/game.scss';

const Game = () => {
  const stateGame = useSelector(state => state.game);
  const dispatch = useDispatch();

  // Go back to menu if game not loaded
  useEffect(() => {
    if (!stateGame.started) {
      dispatch(replace('/menu'));
    }
  }, []);

  return (
    <div className="text-centre top-margin">
      <h4 id="turnIndicator">It's &nbsp;
        <span id="curPlayer">your</span>
      &nbsp; turn!</h4>

      <hr />

      <p>Cards and stuff</p>

      <hr />

      <p>Hand and buttons</p>
    </div>
  );
};

export default Game;
