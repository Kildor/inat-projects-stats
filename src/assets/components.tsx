import React, { ReactElement } from 'react';
import { ListPage, AboutPage, NotFound, Settings, MissedSpecies, ProjectMembers, NewSpecies, ListSpecies, DownloadObservations, ContributionPage } from 'pages';
import { RouteProps } from 'react-router-dom';

/** Параметры компонента-страницы приложения */
interface iComponentListItem extends Pick<RouteProps, 'path' | 'exact'> {
  /** Компонент. */
  component: ReactElement;
};

/** Список страниц приложения. */
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

  { path: '*', component: <NotFound /> },
];
