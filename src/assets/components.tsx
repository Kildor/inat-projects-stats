import React, { ReactElement } from 'react';
import { ListPage, AboutPage, NotFound, Settings, MissedSpecies, ProjectMembers, NewSpecies, ListSpecies, DownloadObservations, ContributionPage } from 'pages';

import DownloaderLegacy from '../pages/legacy/Downloader';
import { Contribution as ContributionLegacy } from '../pages/legacy/Contribution';
import SpeciesListLegacy from '../pages/legacy/SpeciesList';
import NewSpeciesLegacy from '../pages/legacy/Species';
import SpeciesMissedLegacy from '../pages/legacy/SpeciesMissed';
import MembersLegacy from '../pages/legacy/Members';
import UserSettingsLegacy from '../pages/legacy/UserSettings';

interface iComponentListItem {
  path: string
  component: ReactElement
  exact?: boolean

};

export const components: iComponentListItem[] = [
  { path: '/', component: <ListPage />, exact: true },
  { path: '/contribution', component: <ContributionPage /> },
  { path: '/members', component: <ProjectMembers /> },
  { path: '/new-species', component: <NewSpecies /> },
  { path: '/species', component: <ListSpecies /> },
  { path: '/download-observations', component: <DownloadObservations /> },
  { path: '/missed-species', component: <MissedSpecies /> },
  { path: '/about', component: <AboutPage /> },
  { path: '/user-settings', component: <Settings /> },
  // старые версии.
  { path: '/contribution-legacy', component: <ContributionLegacy /> },
  { path: '/species-legacy', component: <SpeciesListLegacy /> },
  { path: '/members-legacy', component: <MembersLegacy /> },
  { path: '/new-species-legacy', component: <NewSpeciesLegacy /> },
  { path: '/user-settings-legacy', component: <UserSettingsLegacy /> },
  { path: '/missed-species-legacy', component: <SpeciesMissedLegacy /> },
  { path: '/download-observations-legacy', component: <DownloaderLegacy /> },

  { path: '*', component: <NotFound /> },
];
