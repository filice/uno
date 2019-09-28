import React, { useEffect, useState } from 'react';
import { replace } from 'connected-react-router';
import { useDispatch, useSelector } from 'react-redux';

import '../styles/game.scss';
import * as socket from '../socket';
import Card from './Card';
import ChooseColourModal from './ChooseColourModal';
import Hand from './Hand';
import PlayerList from './PlayerList';

const Game = () => {
  const [myTurn, setMyTurn] = useState(false);
  const [showChooseColour, setShowChooseColour] = useState(false);

  const stateGame = useSelector(state => state.game);
  const statePlayer = useSelector(state => state.player);
  const dispatch = useDispatch();

  // Go back to menu if game not loaded
  useEffect(() => {
    if (!stateGame.started) {
      dispatch(replace('/menu'));
    }
  }, []);

  // Check if it's my turn
  useEffect(() => {
    setMyTurn(stateGame.curTurn === statePlayer.uuid);
  }, [stateGame]);

  const showChooseColourModal = type => setShowChooseColour(type);

  const hideChooseColourModal = () => setShowChooseColour(false);

  const drawCard = () => socket.drawCard();

  const renderTurnIndicator = () => {
    if (!stateGame.curTurn || !stateGame.players) {
      return <h4 id="turnIndicator">Loading...</h4>;
    }

    if (myTurn) {
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

  const renderGame = () => (
    <>
      {renderDiscard()}
      <PlayerList />
    </>
  );

  const renderHand = () => {
    if (!statePlayer.hand) {
      return <p>Loading...</p>;
    }

    return <Hand discardTop={stateGame.discardTop}
                 myTurn={myTurn}
                 showChooseColourModal={showChooseColourModal}
           />;
  };

  return (
    <div className="text-centre top-margin">
      {renderTurnIndicator()}

      <hr />

      {renderGame()}

      <hr />

        <button onClick={drawCard}
                disabled={!myTurn}
        >
          Draw
        </button>

      {renderHand()}

        <ChooseColourModal
          show={showChooseColour}
          hideChooseColourModal={hideChooseColourModal}
        />
    </div>
  );
};

export default Game;
