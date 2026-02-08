import '@testing-library/jest-dom/vitest';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

// Extend dayjs with timezone support globally for all tests
dayjs.extend(utc);
dayjs.extend(timezone);

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] ?? null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    }),
    get length() {
      return Object.keys(store).length;
    },
    key: vi.fn((index: number) => Object.keys(store)[index] ?? null),
  };
})();

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Mock next-intl
// next-intl returns `${namespace}.${key}` for missing translations
vi.mock('next-intl', () => ({
  useTranslations: (namespace?: string) => {
    const t = (key: string) => {
      // Return just the key (simulating a found translation)
      return key;
    };
    return t;
  },
  useLocale: () => 'en',
}));

// Mock next-plausible
vi.mock('next-plausible', () => ({
  usePlausible: () => vi.fn(),
}));

// Mock next/link
vi.mock('next/link', () => {
  const React = require('react');
  return {
    default: ({ children, href, ...props }: any) =>
      React.createElement('a', { href, ...props }, children),
  };
});

// Mock next/image
vi.mock('next/image', () => {
  const React = require('react');
  return {
    default: ({ src, alt, ...props }: any) =>
      React.createElement('img', { src, alt, ...props }),
  };
});

// Reset mocks between tests
beforeEach(() => {
  localStorageMock.clear();
  vi.clearAllMocks();
});
