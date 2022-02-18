import React from 'react';
import { Translate } from '../Translation';
import { MenuLanguagesWrapped, MenuPagesWrapped } from './HeaderMenu';
import { ReactComponent as Bird} from 'assets/inat-bird.svg'


export const Header = () => (
  <header className="App-header">
    <h1><Bird className="inat-logo" /> <Translate>iNat utils</Translate></h1>
    <MenuLanguagesWrapped />
    <MenuPagesWrapped />
  </header>
);
