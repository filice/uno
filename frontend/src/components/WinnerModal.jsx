import React, { useEffect, useState } from 'react';
import { replace } from 'connected-react-router';
import { useDispatch, useSelector } from 'react-redux';

import '../styles/winnerModal.scss';

const WinnerModal = ({ winner }) => {
  const [winnerName, setWinnerName] = useState('');

  const statePlayers = useSelector(state => state.game.players);
  const dispatch = useDispatch();

  // Show winner name
  useEffect(() => {
    for (const player of statePlayers) {
      if (player.uuid == winner) {
        setWinnerName(player.name);
      }
    }
  }, [winner]);

  const backToLobby = () => {
    dispatch(replace('/menu'));
  };

  return (
    <div className={`modal ${winner ? 'show' : 'hide'}`}>
      <h4 style={{color: "#000"}}>{winnerName} wins!</h4>
      <hr />
      <button style={{color: "#000"}} onClick={backToLobby}>Back to Menu</button>
    </div>
  );
};

export default WinnerModal;
