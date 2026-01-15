'use client';

import React, { useContext, FunctionComponent } from 'react';
import { useUserContext } from 'components/UserContext';
import dayjs from 'dayjs';
import Race, { RaceRow } from 'components/Race/Race';
import RaceModel from '../../models/RaceModel';
import { useTranslations } from 'next-intl';

export interface Props {
  year: number;
  races: [RaceModel];
  locale?: string;
  config: any;
}

const Races = ({ year, races, config }: Props) => {
  const currentTime = new Date();
  const t = useTranslations('All');
  const title = t(`${process.env.NEXT_PUBLIC_SITE_KEY}.title`);

  let { timezone, timeFormat, collapsePastRaces, updateCollapsePastRaces } =
    useUserContext();

  //if (props.locale) locale = props.locale;

  let isNextRace = false;
  let hasSetNextRace = false;

  // Check if we have more than 1 race that has already occurred and collapse them.
  const racesOccured = races.reduce((count, item) => {
    if (!item.sessions) return count;

    const lastSessionKey = Object.keys(item.sessions).at(-1);
    if (!lastSessionKey) return count;

    const hasOccurred = dayjs(item.sessions[lastSessionKey])
      .add(2, 'hours')
      .isBefore(dayjs(currentTime));

    return hasOccurred ? count + 1 : count;
  }, 0);

  const shouldCollapsePastRaces =
    racesOccured > 1 && racesOccured < races.length && collapsePastRaces;

  return (
    <div>
      <table id="events-table" className="w-full">
        {config.featuredSessions.length === 1 ? (
          <thead className="hidden">
            <tr>
              <th scope="col" className="w-8" id="toggle_header">
                Toggle
              </th>
              <th scope="col">{title}</th>
              <th scope="col" id="date_header">
                {t('date')}
              </th>
              <th scope="col" id="time_header">
                {t('time')}
              </th>
            </tr>
          </thead>
        ) : (
          <thead>
            <tr className="hidden">
              <th scope="col" className="w-8"></th>
              <th scope="col">{title}</th>
              {config.featuredSessions.map((item: string, index: number) => {
                return <th scope="col" key={`${item}-col`}></th>;
              })}
            </tr>
          </thead>
        )}

        {races.map((item, index) => {
          const hasMultipleFeaturedEvents =
            config.featuredSessions.length !== 1;

          const sessionKeys = Object.keys(item.sessions || {});
          const lastSessionKey = sessionKeys.at(-1);

          const sessionDate = item.sessions
            ? hasMultipleFeaturedEvents && lastSessionKey
              ? dayjs(item.sessions[lastSessionKey])
              : dayjs(item.sessions[config.featuredSessions[0]])
            : dayjs();

          isNextRace = false;

          if (
            item.sessions &&
            sessionDate.isAfter(dayjs(currentTime)) &&
            !hasSetNextRace &&
            !item.canceled &&
            !item.tbc
          ) {
            isNextRace = true;
            hasSetNextRace = true;
          }

          const race: RaceRow = {
            isNextRace,
            hasOccured: sessionDate.isBefore(dayjs(currentTime)),
            shouldCollapsePastRaces,
            index,
            item,
            collapsed: !isNextRace,
            config,
            currentTime
          };

          return <Race {...race} key={`${item.slug}-race`} />;
        })}
      </table>
    </div>
  );
};

export default Races;
