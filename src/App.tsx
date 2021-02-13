import React, { useState } from 'react';
import { BrowserRouter as Router, Switch, Route, Link, useRouteMatch } from 'react-router-dom';
import './App.scss';
import List from './pages/List';
import Species from './pages/Species';
import NotFound from './pages/NotFound';
import Members from './pages/Members';
import SpeciesList from './pages/SpeciesList';
import modules from './assets/modules.json';
import SpeciesMissed from './pages/SpeciesMissed';
// const components = {
//   "List": List,
//   "Species": Species,
//   "NotFound": NotFound,
//   "Members": Members,
//   "SpeciesList": SpeciesList
// };
const Header = () => {
  const [state, setstate] = useState(false);
  
  return (
    <header className="App-header">
      <h1>Inat utils</h1>
      <div className='header-menu'>
        <button className={'button btn-menu ' + (state ? 'open' : '')} onClick={() => setstate(!state)}>☰ Menu</button>
      <ul>
        {modules.map(module=>
          ListItem(module, setstate)
        )}
      </ul>
      </div>
    </header>
  );
}
function ListItem(module: { url: string; title: string; }, setstate: React.Dispatch<React.SetStateAction<boolean>>): JSX.Element {
  let match = useRouteMatch({
    path: module.url,
    exact: true
  });

  return <li key={module.url} className={match ? 'active':''}>
    <Link onClick={() => setstate(false)} to={module.url}>{module.title}</Link>
  </li>;
}

function App() {
  return (
    <Router basename='inat'>
    <div className="App">
      <Header/>
      <Switch>
        <Route exact path='/'><List/></Route>
        <Route path='/new-species'><Species/></Route>
        <Route path='/contribution'><SpeciesList/></Route>
        <Route path='/members'><Members/></Route>
        <Route path='/species'><SpeciesList/></Route>
        <Route path='/missed-species'><SpeciesMissed/></Route>
        {/* <Route path='/umbrella-top'><UmbrellaTop/></Route> */}
        <Route path='*'><NotFound/></Route>
      </Switch>
    </div>
    </Router>
  );
}

export default App;
