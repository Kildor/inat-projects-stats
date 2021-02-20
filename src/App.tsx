import React, { useState } from 'react';
import { BrowserRouter as Router, Switch, Route, Link, useRouteMatch } from 'react-router-dom';
import './App.scss';
import List from './pages/List';
import About from './pages/About';
import Species from './pages/Species';
import NotFound from './pages/NotFound';
import Members from './pages/Members';
import SpeciesList from './pages/SpeciesList';
import modules from './assets/modules.json';
import SpeciesMissed from './pages/SpeciesMissed';
import Downloader from './pages/Downloader';
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
const Footer = () => {
  return (
    <footer className='app-footer'>
      <span>© 2020-2021, <a href='https://kildor.name/'>Константин (Kildor) Романов</a></span> <i></i> <Link to='/about'>О приложении</Link> <i></i> <a href='https://github.com/Kildor/inat-projects-stats'>Github</a>
    </footer>
  )
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
    <div className="App">
    <Router basename='inat'>
        <Header />
      <Switch>
        <Route exact path='/'><List/></Route>
        <Route path='/new-species'><Species/></Route>
        <Route path='/contribution'><SpeciesList/></Route>
        <Route path='/members'><Members/></Route>
        <Route path='/species'><SpeciesList/></Route>
        <Route path='/download-observations'><Downloader/></Route>
        <Route path='/missed-species'><SpeciesMissed/></Route>
        <Route path='/about'><About/></Route>
        {/* <Route path='/umbrella-top'><UmbrellaTop/></Route> */}
        <Route path='*'><NotFound/></Route>
      </Switch>
      <Footer/>
    </Router>
    </div>
  );
}

export default App;
