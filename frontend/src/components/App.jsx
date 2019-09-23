import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

import 'typeface-inter';
import '../styles/app.scss';

import Game from './Game';
import Lobby from './Lobby';
import Menu from './Menu';

const App = () => (
  <div className="container">
    <Switch>
      <Redirect exact path='/' to='/menu' />
      <Route path='/game' component={Game} />
      <Route path='/lobby' component={Lobby} />
      <Route path='/menu' component={Menu} />
    </Switch>
  </div>
);

export default App;
