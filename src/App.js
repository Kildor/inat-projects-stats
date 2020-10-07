import React, { useState } from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import List from './pages/List';
import Species from './pages/Species';

import './App.scss';
import NotFound from './pages/NotFound';
import Members from './pages/Members';
import Contribution from './pages/Contribution';
import SpeciesList from './pages/SpeciesList';

const Header = () => {
  const [state, setstate] = useState(false);
  return (
    <header className="App-header">
      <h1>Inat projects utils</h1>
      <div className='header-menu'>
      <button className={'button btn-menu '+ (state?'open':'')} onClick={()=>setstate(!state)}>Menu</button>
      <ul>
        <li>
            <Link onClick={() => setstate(!state)} to='/new-species'>Новые виды в проекте</Link>
        </li>
        <li>
            <Link onClick={() => setstate(!state)} to='/members'>Участники проекта</Link>
        </li>
        <li>
            <Link onClick={() => setstate(!state)}to='/contribution'>Вклад наблюдателя</Link>
        </li>
        <li>
            <Link onClick={() => setstate(!state)}to='/species'>Список видов проекта</Link>
        </li>
      </ul>
      </div>
    </header>
  );
}
function App() {
  return (
    <Router basename='inat'>
    <div className="App">
      <Header/>
      <Switch>
        <Route exact path='/'>
        <List/>
        </Route>
        <Route path='/new-species'><Species/></Route>
        <Route path='/contribution'><Contribution/></Route>
        <Route path='/members'><Members/></Route>
        <Route path='/species'><SpeciesList/></Route>
        <Route path='*'><NotFound/></Route>
      </Switch>
    </div>
    </Router>
  );
}

export default App;
