import dayjs from 'dayjs';

export const mockConfig = {
  featuredSessions: ['final'],
  supportsWebPush: false,
  trmnlPlugin: null,
};

export function createMockRace(overrides: Record<string, any> = {}) {
  return {
    round: 1,
    name: 'Test Open',
    location: 'Test City',
    latitude: '0',
    longitude: '0',
    slug: 'test-open',
    localeKey: 'testOpen',
    sessions: {
      r32: '2025-06-10T09:00:00Z',
      r16: '2025-06-11T09:00:00Z',
      quarterfinal: '2025-06-12T13:00:00Z',
      semifinal: '2025-06-13T13:00:00Z',
      final: '2025-06-14T13:00:00Z',
    },
    tbc: false,
    canceled: false,
    ...overrides,
  };
}

export function createFutureRace(overrides: Record<string, any> = {}) {
  const futureDate = dayjs().add(30, 'day');
  return createMockRace({
    name: 'Future Open',
    slug: 'future-open',
    localeKey: 'futureOpen',
    sessions: {
      r32: futureDate.toISOString(),
      r16: futureDate.add(1, 'day').toISOString(),
      quarterfinal: futureDate.add(2, 'day').toISOString(),
      semifinal: futureDate.add(3, 'day').toISOString(),
      final: futureDate.add(4, 'day').toISOString(),
    },
    ...overrides,
  });
}

export function createPastRace(overrides: Record<string, any> = {}) {
  const pastDate = dayjs().subtract(30, 'day');
  return createMockRace({
    name: 'Past Open',
    slug: 'past-open',
    localeKey: 'pastOpen',
    sessions: {
      r32: pastDate.toISOString(),
      r16: pastDate.add(1, 'day').toISOString(),
      quarterfinal: pastDate.add(2, 'day').toISOString(),
      semifinal: pastDate.add(3, 'day').toISOString(),
      final: pastDate.add(4, 'day').toISOString(),
    },
    ...overrides,
  });
}
