import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

import 'typeface-inter';
import '../styles/app.scss';

import Menu from './Menu';
import Lobby from './Lobby';

const App = () => (
  <div className="container">
    <Switch>
      <Redirect exact path='/' to='/menu' />
      <Route path='/menu' component={Menu} />
      <Route path='/lobby' component={Lobby} />
    </Switch>
  </div>
);

export default App;
