import React, { ReactElement } from 'react';
import List from '../pages/List';
import About from '../pages/About';
import Species from '../pages/Species';
import NotFound from '../pages/NotFound';
import Members from '../pages/Members';
import SpeciesList from '../pages/SpeciesList';
import SpeciesMissed from '../pages/SpeciesMissed';
import Downloader from '../pages/Downloader';
import UserSettings from '../pages/UserSettings';
import Contribution from '../pages/Contribution';

interface iComponentListItem {
  path: string
  component: ReactElement
  exact?: boolean

};

export const components: iComponentListItem[] = [
  { path: '/', component: <List />, exact: true },
  { path: '/contribution', component: <Contribution /> },
  { path: '/members', component: <Members /> },
  { path: '/new-species', component: <Species /> },
  { path: '/species', component: <SpeciesList /> },
  { path: '/download-observations', component: <Downloader /> },
  { path: '/missed-species', component: <SpeciesMissed /> },
  { path: '/about', component: <About /> },
  { path: '/user-settings', component: <UserSettings /> },
  { path: '*', component: <NotFound /> },
];
