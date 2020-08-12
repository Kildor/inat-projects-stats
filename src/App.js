import React from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import List from './pages/List';
import Species from './pages/Species';

import './App.scss';

function App() {
  return (
    <Router basename='inat'>
    <div className="App">
      <header className="App-header">
          <h1>Inat projects utils</h1>
        <ul>
          <li>
            <Link to='/new-species'>Новые виды в проекте</Link>
          </li>
        </ul>
      </header>
      <Switch>
        <Route exact path='/'>
        <List/>
        </Route>
        <Route path='/new-species'><Species/></Route>
      </Switch>
    </div>
    </Router>
  );
}

export default App;
