import { NextRequest, NextResponse } from 'next/server';
import { createEvents } from 'ics';
import dayjs from 'dayjs';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    const filters = {
      includeOpen: searchParams.get('o') === '1',
      minCategory: searchParams.get('lc') || 'all',
      includeChampionship: searchParams.get('c') === '1',
      includeFinals: searchParams.get('f') === '1',
      includeOlympics: searchParams.get('y') === '1',
      includeAsianGames: searchParams.get('g') === '1',
      onlyMajor: searchParams.get('m') === '1',
      includeGroup: searchParams.get('sg') === '1',
      includeSemifinal: searchParams.get('ss') === '1',
      includeFinal: searchParams.get('sf') === '1',
      alarmMinutes: parseInt(searchParams.get('a') || '0'),
      language: searchParams.get('lang') || 'zh',
    };

    const config = require(`/_db/badminton/config.json`);
    const yearData = require(
      `/_db/badminton/${config.calendarOutputYear}.json`,
    );

    const i18n = require(`/locales/${filters.language}/localization.json`);
    const strings = i18n['All'];

    const filteredRaces = yearData.races.filter((race: any) => {
      const typeMatch =
        (race.type === 'open' && filters.includeOpen) ||
        (race.type === 'championship' && filters.includeChampionship) ||
        (race.type === 'finals' && filters.includeFinals) ||
        (race.type === 'olympics' && filters.includeOlympics) ||
        (race.type === 'asiangames' && filters.includeAsianGames);

      if (!typeMatch) return false;

      if (race.type === 'open' && filters.minCategory !== 'all') {
        const raceLevel = parseInt(race.category);
        const minLevel = parseInt(filters.minCategory);
        if (raceLevel < minLevel) return false;
      }

      if (filters.onlyMajor && !race.isMajor) return false;

      return true;
    });

    const events = [];

    for (const race of filteredRaces) {
      for (const [dayKey, dateStr] of Object.entries(race.sessions)) {
        const sessionType = race.sessionTypes?.[dayKey] || 'group';

        if (sessionType === 'group' && !filters.includeGroup) continue;
        if (sessionType === 'semifinal' && !filters.includeSemifinal) continue;
        if (sessionType === 'final' && !filters.includeFinal) continue;

        const raceName = strings.races?.[race.localeKey] || race.name;
        const sessionName =
          strings.sessionTypes?.[sessionType] ||
          config.sessionTypes?.[sessionType]?.name ||
          sessionType;

        const alarms = [];
        if (filters.alarmMinutes > 0) {
          alarms.push({
            action: 'display' as 'display' | 'audio' | 'email',
            description: `${raceName} - ${sessionName} 即将开始`,
            trigger: { minutes: filters.alarmMinutes, before: true },
            repeat: 0,
          });
        }

        const startDate = dayjs(dateStr as string);

        events.push({
          start: [
            startDate.year(),
            startDate.month() + 1,
            startDate.date(),
            9,
            0,
          ] as [number, number, number, number, number],
          end: [
            startDate.year(),
            startDate.month() + 1,
            startDate.date(),
            21,
            0,
          ] as [number, number, number, number, number],
          title: `羽毛球: ${sessionName} (${raceName})`,
          description: `赛事：${raceName}\n地点：${race.location}`,
          location: race.location,
          url: `https://badminton-calendar.com/race/${race.slug}`,
          uid: `${config.calendarOutputYear}-${race.slug}-${dayKey}`,
          productId: 'badminton-calendar.com',
          status: (race.tbc ? 'TENTATIVE' : 'CONFIRMED') as
            | 'TENTATIVE'
            | 'CONFIRMED'
            | 'CANCELLED',
          alarms: alarms.length > 0 ? alarms : undefined,
        });
      }
    }

    const { error, value } = createEvents(events);

    if (error) {
      throw new Error(error.message);
    }

    const fileName = generateFileName(filters);

    return new NextResponse(value, {
      status: 200,
      headers: {
        'Content-Type': 'text/calendar; charset=utf-8',
        'Content-Disposition': `attachment; filename="${encodeURIComponent(fileName)}"`,
        'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
        'Content-Length': Buffer.byteLength(value, 'utf8').toString(),
      },
    });
  } catch (error) {
    console.error('Error generating ICS file:', error);
    return NextResponse.json(
      { error: 'Failed to generate ICS file' },
      { status: 500 },
    );
  }
}

function generateFileName(filters: {
  includeOpen: boolean;
  minCategory: string;
  includeChampionship: boolean;
  includeFinals: boolean;
  includeOlympics: boolean;
  includeAsianGames: boolean;
  alarmMinutes: number;
}): string {
  const parts = ['badminton-calendar'];

  if (filters.includeOpen) {
    parts.push('open');
    if (filters.minCategory !== 'all') {
      parts.push(filters.minCategory);
    }
  }

  if (filters.includeChampionship) parts.push('championship');
  if (filters.includeFinals) parts.push('finals');
  if (filters.includeOlympics) parts.push('olympics');
  if (filters.includeAsianGames) parts.push('asiangames');

  if (filters.alarmMinutes > 0) {
    parts.push(`alarm-${filters.alarmMinutes}`);
  }

  return `${parts.join('_')}.ics`;
}
