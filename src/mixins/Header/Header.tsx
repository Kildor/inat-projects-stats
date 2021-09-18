import React from 'react';
import { Translate } from '../Translation';
import { MenuLanguagesWrapped, MenuPagesWrapped } from './HeaderMenu';

export const Header = () => (
  <header className="App-header">
    <h1><Translate>iNat utils</Translate></h1>
    <MenuLanguagesWrapped />
    <MenuPagesWrapped />
  </header>
);
