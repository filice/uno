import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import '../styles/menu.scss';
import { createGame, createPlayer } from '../actions';

const Menu = () => {
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  const stateCreatePlayer = useSelector(state => state.createPlayer);
  const stateCreateGame = useSelector(state => state.createGame);
  const dispatch = useDispatch();

  useEffect(() => {
    if (stateCreatePlayer.error) {
      setError(stateCreatePlayer.error);
    }
    if (stateCreateGame.error) {
      setError(stateCreateGame.error);
    }
  }, [stateCreatePlayer, stateCreateGame]);

  const handleChange = e => {
    switch (e.target.id) {
      case 'name':
        setName(e.target.value);
        break;
      case 'code':
        setCode(e.target.value);
        break;
    }
  };

  const aboutClick = () => {
    // ...
  };

  const openSourceClick = () => {
    window.open('https://github.com/IvanFon/uno', '_blank');
  };

  const validateName = n => {
    if (!n || n.length < 4 || n.length > 15) return false;

    return true;
  }

  const validateCode = c => {
    if (!c || c.length !== 5) return false;

    return true;
  }

  const createGameClicked = e => {
    e.preventDefault();

    if (!validateName(name)) {
      return setError('Name must be 4 - 15 characters long.');
    }

    setError('');

    dispatch(createGame(name));
  };

  const joinGameClicked = e => {
    e.preventDefault();

    if (!validateName(name)) {
      return setError('Name must be 4 - 15 characters long.');
    }

    if (!validateCode(code)) {
      return setError('Game ID invalid.');
    }

    setError('');

    dispatch(createPlayer(name, code));
  }

  const renderSubmit = () => {
    let render = [];

    if (stateCreatePlayer.loading || stateCreateGame.loading) {
      return <p>Loading...</p>;
    }

    if (!code) {
      render.push(<button key="create" onClick={createGameClicked}>
        Create Game
      </button>);
    } else {
      render.push(<button key="join" onClick={joinGameClicked}>
        Join Game
      </button>);
    }

    if (error) {
      render.push(<p className="error" key="error">{error}</p>);
    }

    return <>{render}</>;
  };

  return (
    <div className="text-centre top-margin">
      <h1>uno</h1>
      <p>
        <span className="link" onClick={aboutClick}>
          about
        </span>&nbsp;-&nbsp;
        <span className="link" onClick={openSourceClick}>
          open-source
        </span>
      </p>

      <hr />

      <form>

        <input className="text-centre"
          id="name"
          type="text"
          value={name}
          onChange={handleChange}
          placeholder="name"
          minLength="4"
          maxLength="15"
        />
        <br />
        <input className="text-centre"
          id="code"
          type="text"
          value={code}
          onChange={handleChange}
          placeholder="code (blank to create)"
          maxLength="5"
        />

        <br />

        { renderSubmit() }

      </form>
    </div>
  );
};

export default Menu;
