import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import RaceTR from '../RaceTR';
import { UserContextProvider } from '../../UserContext';
import { mockConfig } from '../../../__tests__/helpers/fixtures';

function renderRaceTR(overrides: Record<string, any> = {}) {
  const defaultProps = {
    sessionTitle: 'Final',
    date: '2025-08-10T13:00:00Z',
    collapsed: false,
    hasOccured: false,
    hasMultipleFeaturedEvents: false,
    isNextRace: false,
    isFeaturedSession: false,
    event: 'Test Open',
    eventLocaleKey: 'races.testOpen',
    slug: 'test-open',
    index: 0,
    config: mockConfig,
  };

  const props = { ...defaultProps, ...overrides };

  return render(
    <UserContextProvider>
      <table>
        <tbody>
          <RaceTR {...props} />
        </tbody>
      </table>
    </UserContextProvider>,
  );
}

describe('RaceTR', () => {
  it('renders session title', () => {
    renderRaceTR();
    expect(screen.getByText('Final')).toBeInTheDocument();
  });

  it('applies hidden class when collapsed', () => {
    renderRaceTR({ collapsed: true });
    const row = screen.getByText('Final').closest('tr');
    expect(row?.className).toContain('hidden');
  });

  it('does not have hidden class when expanded', () => {
    renderRaceTR({ collapsed: false });
    const row = screen.getByText('Final').closest('tr');
    expect(row?.className).not.toContain('hidden');
  });

  it('applies line-through for past sessions', () => {
    renderRaceTR({ hasOccured: true });
    const row = screen.getByText('Final').closest('tr');
    expect(row?.className).toContain('line-through');
  });
});
