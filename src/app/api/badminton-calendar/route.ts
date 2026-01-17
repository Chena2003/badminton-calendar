import { NextRequest, NextResponse } from 'next/server';
import { createEvents } from 'ics';
import dayjs from 'dayjs';
import path from 'path';
import fs from 'fs';

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

    const configPath = path.join(process.cwd(), `_db/badminton/config.json`);
    const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));

    const yearDataPath = path.join(process.cwd(), `_db/badminton/${config.calendarOutputYear}.json`);
    const yearData = JSON.parse(fs.readFileSync(yearDataPath, 'utf-8'));

    const i18nPath = path.join(process.cwd(), `locales/${filters.language}/localization.json`);
    const i18n = JSON.parse(fs.readFileSync(i18nPath, 'utf-8'));
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

    // Helper function to create date array
    const createDateArray = (date: dayjs.Dayjs, hour: number): [number, number, number, number, number] => [
      date.year(),
      date.month() + 1,
      date.date(),
      hour,
      0,
    ];

    // Helper function to check if session should be included
    const shouldIncludeSession = (sessionType: string): boolean => {
      const sessionFilters: Record<string, boolean> = {
        group: filters.includeGroup,
        semifinal: filters.includeSemifinal,
        final: filters.includeFinal,
      };
      return sessionFilters[sessionType] ?? true;
    };

    for (const race of filteredRaces) {
      for (const [dayKey, dateStr] of Object.entries(race.sessions)) {
        const sessionType = race.sessionTypes?.[dayKey] || 'group';

        if (!shouldIncludeSession(sessionType)) continue;

        const raceName = strings.races?.[race.localeKey] || race.name;
        const sessionName =
          strings.sessionTypes?.[sessionType] ||
          config.sessionTypes?.[sessionType]?.name ||
          sessionType;

        const alarms = [];
        if (filters.alarmMinutes > 0) {
          alarms.push({
            action: 'display' as 'display' | 'audio' | 'email',
            description: `${strings.calendar?.alarm || '即将开始'}: ${raceName} - ${sessionName}`,
            trigger: { minutes: filters.alarmMinutes, before: true },
            repeat: 0,
          });
        }

        const startDate = dayjs(dateStr as string);

        events.push({
          start: createDateArray(startDate, 9),
          end: createDateArray(startDate, 21),
          title: `${strings.calendar?.title || '羽毛球'}: ${sessionName} (${raceName})`,
          description: `${strings.calendar?.description || '赛事'}：${raceName}\n${strings.calendar?.location || '地点'}：${race.location}`,
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
