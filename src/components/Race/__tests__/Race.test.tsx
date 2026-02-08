import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Race from '../Race';
import { UserContextProvider } from '../../UserContext';
import {
  mockConfig,
  createFutureRace,
  createPastRace,
} from '../../../__tests__/helpers/fixtures';

function renderRace(overrides: Record<string, any> = {}) {
  const defaultProps = {
    item: createFutureRace(),
    index: 0,
    shouldCollapsePastRaces: false,
    isNextRace: false,
    config: mockConfig,
    currentTime: new Date(),
    hasOccured: false,
    collapsed: true,
  };

  const props = { ...defaultProps, ...overrides };

  return render(
    <UserContextProvider>
      <table>
        <Race {...props} />
      </table>
    </UserContextProvider>,
  );
}

describe('Race', () => {
  it('renders race title', () => {
    renderRace();
    // The mock useTranslations returns the key itself: 'races.futureOpen'
    // Since 'races.futureOpen' != 'All.races.futureOpen', the component uses the translation
    expect(screen.getByText('races.futureOpen')).toBeInTheDocument();
  });

  it('shows NextBadge when isNextRace is true', () => {
    renderRace({ isNextRace: true });
    expect(screen.getByText('badges.next')).toBeInTheDocument();
  });

  it('shows TBCBadge when tbc is true', () => {
    renderRace({ item: createFutureRace({ tbc: true }) });
    expect(screen.getByText('badges.tbc')).toBeInTheDocument();
  });

  it('shows CanceledBadge when canceled is true', () => {
    renderRace({ item: createFutureRace({ canceled: true }) });
    expect(screen.getByText('badges.canceled')).toBeInTheDocument();
  });

  it('is collapsed by default when not nextRace', () => {
    renderRace({ isNextRace: false });
    // Session rows should have hidden class when collapsed
    const sessionRows = document.querySelectorAll('tr.hidden');
    expect(sessionRows.length).toBeGreaterThan(0);
  });

  it('is expanded by default when isNextRace', () => {
    renderRace({ isNextRace: true });
    // Session rows should NOT have hidden class when expanded
    const hiddenRows = document.querySelectorAll('tr.hidden');
    expect(hiddenRows.length).toBe(0);
  });

  it('toggles expand/collapse on header row click', async () => {
    const user = userEvent.setup();
    renderRace({ isNextRace: false });

    // Initially collapsed - session rows should be hidden
    let hiddenRows = document.querySelectorAll('tr.hidden');
    expect(hiddenRows.length).toBeGreaterThan(0);

    // Click the header row (the one with cursor-pointer class)
    const headerRow = document.querySelector('tr.cursor-pointer');
    expect(headerRow).toBeTruthy();
    await user.click(headerRow!);

    // After click, session rows should be visible
    hiddenRows = document.querySelectorAll('tr.hidden');
    expect(hiddenRows.length).toBe(0);
  });

  it('applies line-through for past races', () => {
    renderRace({
      item: createPastRace(),
      shouldCollapsePastRaces: false,
    });

    const tbody = document.querySelector('tbody');
    expect(tbody?.className).toContain('line-through');
  });

  it('hides past races when shouldCollapsePastRaces is true', () => {
    renderRace({
      item: createPastRace(),
      shouldCollapsePastRaces: true,
    });

    const tbody = document.querySelector('tbody');
    expect(tbody?.className).toContain('hidden');
  });
});
