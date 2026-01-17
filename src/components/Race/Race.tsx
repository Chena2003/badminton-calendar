'use client';

import dayjs from 'dayjs';
import dayjstimezone from 'dayjs/plugin/timezone';
import dayjsutc from 'dayjs/plugin/utc';
import { useTranslations, useLocale } from 'next-intl';
import { usePlausible } from 'next-plausible';
import React, { useState } from 'react';
import { useUserContext } from '../../components/UserContext';
import RaceModel from '../../models/RaceModel';
import CanceledBadge from '../Badges/CanceledBadge';
import NextBadge from '../Badges/NextBadge';
import TBCBadge from '../Badges/TBCBadge';
import RaceTR from '../Race/RaceTR';
import Toggle from '../Toggle/Toggle';

dayjs.extend(dayjsutc);
dayjs.extend(dayjstimezone);

export interface RaceRow {
  isNextRace: boolean;
  hasOccured: boolean;
  shouldCollapsePastRaces: boolean;
  index: number;
  item: RaceModel;
  collapsed: boolean;
  config: any;
  currentTime: Date;
}

const Race = ({
  item,
  index,
  shouldCollapsePastRaces,
  isNextRace,
  config,
  currentTime,
}: RaceRow) => {
  const t = useTranslations('All');
  const plausible = usePlausible();
  const locale = useLocale();

  let { timezone, timeFormat } = useUserContext();
  const [collapsed, setCollapsed] = useState<Boolean>(!isNextRace);

  // 根据语言环境选择日期格式
  const isChineseLocale = locale === 'zh' || locale === 'zh-HK';
  const dateFormat = isChineseLocale ? 'M月D日' : 'D MMM';

  const handleRowClick = (event: React.MouseEvent<HTMLTableRowElement>) => {
    plausible(!collapsed ? 'Closed Event' : 'Opened Event', {
      props: {
        event: item.slug,
      },
    });

    setCollapsed(!collapsed);
  };

  // Translate race title or fall back to name based on locale
  const raceTitle =
    item.localeKey &&
    t(`races.${item.localeKey}`) != `All.races.${item.localeKey}`
      ? t(`races.${item.localeKey}`)
      : locale === 'en' && item.englishName
      ? item.englishName
      : item.name;

  // Select location based on locale
  const raceLocation =
    locale === 'en' && item.englishLocation
      ? item.englishLocation
      : item.location;

  const hasMultipleFeaturedEvents = config.featuredSessions.length !== 1;

  const sessionKeys = Object.keys(item.sessions || {});
  const firstEventSessionKey = sessionKeys[0];
  const lastEventSessionKey = sessionKeys.at(-1);

  const race: RaceRow = {
    isNextRace,
    hasOccured: lastEventSessionKey
      ? dayjs(item.sessions[lastEventSessionKey]).isBefore(dayjs(currentTime))
      : false,
    shouldCollapsePastRaces,
    index,
    item,
    collapsed: !isNextRace,
    config,
    currentTime,
  };

  return (
    <tbody
      id={item.slug}
      key={`${item.slug}-body`}
      className={`${rowClasses(race)} ${!collapsed ? 'divide-y divide-white/4' : ''}`}
    >
      <tr
        key={`${item.slug}-tr`}
        className="cursor-pointer"
        onClick={handleRowClick}
      >
        <td
          className="w-4 lg:w-8"
          headers={`${item.slug}-header toggle_header`}
        >
          <div className="relative left-2 lg:left-4 w-0">
            <Toggle collapsed={collapsed} />
          </div>
        </td>
        <th
          className={`flex p-4 flex justify-between lg:pr-8`}
          id={`${item.slug}-header`}
        >
          <div className={`${titleRowClasses(race)}`}>
            <div className={titleRowTextClasses(race)}>
              {raceTitle}
              {raceLocation && (
                <span className="ml-2 font-normal text-muted text-sm">
                  - {raceLocation}
                </span>
              )}
            </div>
          </div>
          {isNextRace && !item.tbc && !item.canceled && <NextBadge />}

          {item.tbc && <TBCBadge />}

          {item.canceled && <CanceledBadge />}
        </th>
        {!hasMultipleFeaturedEvents ? (
          <>
            <td
              className={`text-right md:text-left ${titleRowClasses(race)}`}
              headers={`date_header ${item.slug}-header`}
            >
              <span className={titleRowTextClasses(race)}>
                {collapsed &&
                  item.sessions &&
                  item.sessions[config.featuredSessions[0]] &&
                  dayjs(item.sessions[config.featuredSessions[0]])
                    .tz(timezone)
                    .format(dateFormat)}
              </span>
            </td>
            <td
              className={`${titleRowClasses(race)}`}
              headers={`time_header ${item.slug}-header`}
            >
              <div className="text-right md:text-left pr-2 md:pr-0">
                <span className={titleRowTextClasses(race)}>
                  {collapsed &&
                    item.sessions &&
                    item.sessions[config.featuredSessions[0]] &&
                    dayjs(item.sessions[config.featuredSessions[0]])
                      .tz(timezone)
                      .format(timeFormat == 12 ? 'h:mm A' : 'HH:mm')}
                </span>
              </div>
            </td>
          </>
        ) : (
          <td className={`${titleRowClasses(race)}`}>
            <div className="text-right pr-2 md:pr-4">
              <span className={titleRowTextClasses(race)}>
                {item.sessions &&
                dayjs(item.sessions[firstEventSessionKey])
                  .tz(timezone)
                  .format(dateFormat) !=
                  dayjs(item.sessions[lastEventSessionKey])
                    .tz(timezone)
                    .format(dateFormat)
                  ? `${dayjs(item.sessions[firstEventSessionKey])
                      .tz(timezone)
                      .format(dateFormat)} - ${dayjs(
                      item.sessions[lastEventSessionKey],
                    )
                      .tz(timezone)
                      .format(dateFormat)}`
                  : `${dayjs(item.sessions[lastEventSessionKey])
                      .tz(timezone)
                      .format(dateFormat)}`}
              </span>
            </div>
          </td>
        )}
      </tr>

      {sessionRows(race, collapsed)}
    </tbody>
  );

  function sessionRows(props: RaceRow, collapsed: Boolean) {
    if (Object.keys(props.item.sessions).length != 0) {
      var rows: React.ReactElement[] = [];

      var keys = Object.keys(props.item.sessions);

      keys.forEach(function (sessionKey, index) {
        // Translate session title or fallback to session key

        const sessionTitle =
          t(`schedule.${sessionKey}`) != `All.schedule.${sessionKey}`
            ? t(`schedule.${sessionKey}`)
            : sessionKey.replace(/./, (x) => x.toUpperCase());

        const hasOccured = dayjs(props.item.sessions[sessionKey])
          .add(2, 'hours')
          .isBefore(dayjs(props.currentTime));

        rows.push(
          <RaceTR
            key={`${props.item.localeKey}-${sessionKey}`}
            date={props.item.sessions[sessionKey]}
            isNextRace={isNextRace}
            sessionTitle={sessionTitle}
            collapsed={collapsed}
            hasMultipleFeaturedEvents={hasMultipleFeaturedEvents}
            hasOccured={hasOccured}
            isFeaturedSession={config.featuredSessions.includes(sessionKey)}
            event={props.item.name}
            eventLocaleKey={`races.${props.item.localeKey}`}
            slug={props.item.slug}
            index={index}
            config={config}
          />,
        );
      });

      return rows;
    } else {
      return <></>;
    }
  }

  function badgeColumnLayout(race: RaceModel) {
    var badges = [];

    if (race.tbc) {
      badges.push(<TBCBadge />);
    }

    if (race.canceled) {
      badges.push(<CanceledBadge />);
    }

    return badges;
  }

  function rowClasses(props: RaceRow) {
    let classes = 'rounded bg-row ';

    // Fade out TBC races a little
    if (props.item.tbc) {
      classes += 'text-gray-300 ';
    }

    if (!props.item.sessions) {
      return classes + 'text-primary ';
    }

    // Strikethrough past races
    if (props.hasOccured && !props.item.canceled) {
      classes += 'line-through text-muted ';
    } else if (props.hasOccured && props.item.canceled) {
      classes += 'text-muted ';
    } else {
      classes += 'text-primary ';
    }

    if (props.hasOccured && props.shouldCollapsePastRaces) {
      classes += 'hidden';
    }

    return classes;
  }

  function titleRowClasses(props: RaceRow) {
    let classes = '';

    // Highlight Next Race
    if (props.isNextRace) {
      classes += 'text-yellow-600 ';
    }

    if (
      props.item.sessions &&
      lastEventSessionKey &&
      !dayjs(props.item.sessions[lastEventSessionKey])
        .add(2, 'hours')
        .isBefore(dayjs(props.currentTime)) &&
      !props.item.canceled
    ) {
      classes += 'font-semibold ';
    }

    return classes;
  }

  function titleRowTextClasses(props: RaceRow) {
    if (!props.item.canceled) return '';

    return props.hasOccured
      ? 'line-through text-gray-500 '
      : 'line-through text-gray-400 ';
  }
};

export default Race;
