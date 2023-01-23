import React from 'react';
import { Link } from 'react-router-dom';
import I18n from '../classes/I18n';

export const Footer = () => (
    <footer className='app-footer'>
      <span>© 2020-2023, <a href='https://kildor.name/'>Константин (Kildor) Романов</a></span> <i></i> <Link to='/about'>{I18n.t('О приложении')}</Link> <i></i> <a href='https://github.com/Kildor/inat-projects-stats'>Github</a>
    </footer>
  );
