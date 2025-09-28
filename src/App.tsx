import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import 'assets/App.scss';
import { Footer } from 'mixins/Footer';
import { components } from 'assets/components';
import { Header } from 'mixins/Header';
import I18n, { getLanguage } from 'classes/I18n';
import { LanguageContext } from 'mixins/LanguageContext';
import { Loader } from 'mixins/Loader';
import { useLanguageContext } from 'hooks';
import { StatusMessageContextProvider } from 'contexts/status-message-context';

const language = getLanguage();

I18n.initDefault(language.code);

const AppLoader = () => (
  <div className="AppLoader">
    <Loader title={I18n.t("Загружается")} show={true}
      message={I18n.t("Загружается язык приложения")}
    />
  </div>
);

const RoutesSwitch = () => (
  <Switch>
    {components.map(({ path, component, exact = false }) => <Route exact={exact} key={`${path}-${exact ? 0 : 1}`} path={path}>{component}</Route>)}
  </Switch>
);

const InnerApp: React.FC = () => (<Router basename='inat'>
  <Header />
  <StatusMessageContextProvider>
    <RoutesSwitch />
  </StatusMessageContextProvider>
  <Footer />
</Router>);

const App = () => {

  const { languageLoaded, context: languageContext } = useLanguageContext(language);

  const Screen = languageLoaded ? InnerApp : AppLoader;

  return (
    <LanguageContext.Provider value={languageContext}>
      <div className="App">
        <Screen />
      </div>
    </LanguageContext.Provider>
  );
};

export default App;
