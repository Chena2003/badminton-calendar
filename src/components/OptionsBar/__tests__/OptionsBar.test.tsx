import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import OptionsBar from '../OptionsBar';
import { UserContextProvider } from '../../UserContext';

// Mock countries-and-timezones (default import)
const mockTimezones = {
  'Europe/London': { utcOffset: 0, utcOffsetStr: '+00:00' },
  'America/New_York': { utcOffset: -300, utcOffsetStr: '-05:00' },
  'Asia/Tokyo': { utcOffset: 540, utcOffsetStr: '+09:00' },
};

vi.mock('countries-and-timezones', () => ({
  default: {
    getAllTimezones: () => mockTimezones,
  },
  getAllTimezones: () => mockTimezones,
}));

// Mock ThemeToggle to simplify
vi.mock('../../ThemeToggle/ThemeToggle', () => ({
  default: () => <button aria-label="Toggle Dark Mode">Theme</button>,
}));

async function renderOptionsBar() {
  let result: any;
  await act(async () => {
    result = render(
      <UserContextProvider>
        <OptionsBar />
      </UserContextProvider>,
    );
  });
  return result;
}

describe('OptionsBar', () => {
  it('displays current timezone in collapsed view', async () => {
    await renderOptionsBar();
    // In collapsed view, the button shows the timezone text
    // The text contains "options.timezonePicker.showing" (from mock translation)
    const tzButton = screen.getByText(/options\.timezonePicker\.showing/);
    expect(tzButton).toBeInTheDocument();
  });

  it('expands options panel on settings button click', async () => {
    const user = userEvent.setup();
    await renderOptionsBar();

    // Click the settings gear button to expand
    const settingsButton = screen.getByLabelText('Settings');
    await user.click(settingsButton);

    // After expanding, the timezone select should be visible
    expect(screen.getByLabelText(/options\.timezonePicker\.showing/)).toBeInTheDocument();
    // Format picker should be visible
    expect(screen.getByText('options.formatPicker.title')).toBeInTheDocument();
    // Collapse past races checkbox should be visible
    expect(screen.getByText('hidePreviousRaces')).toBeInTheDocument();
  });

  it('shows timezone picker, format picker, and collapse toggle when expanded', async () => {
    const user = userEvent.setup();
    await renderOptionsBar();

    // Click to expand
    const settingsButton = screen.getByLabelText('Settings');
    await user.click(settingsButton);

    // Should show timezone select
    expect(screen.getByRole('combobox', { name: /options\.timezonePicker\.showing/ })).toBeInTheDocument();
    // Should show format select
    expect(screen.getByRole('combobox', { name: 'options.formatPicker.title' })).toBeInTheDocument();
    // Should show collapse past races checkbox
    expect(screen.getByRole('checkbox', { name: 'hidePreviousRaces' })).toBeInTheDocument();
  });

  it('collapses panel on confirm button click', async () => {
    const user = userEvent.setup();
    await renderOptionsBar();

    // Expand first
    const settingsButton = screen.getByLabelText('Settings');
    await user.click(settingsButton);

    // Verify expanded - format picker label should be visible
    expect(screen.getByText('options.formatPicker.title')).toBeInTheDocument();

    // Now click the confirm/OK button
    const confirmButton = screen.getByText('options.button');
    await user.click(confirmButton);

    // After collapsing, the format picker label should be gone
    expect(screen.queryByText('options.formatPicker.title')).not.toBeInTheDocument();
  });

  it('has ThemeToggle button', async () => {
    await renderOptionsBar();
    const themeButton = screen.getByLabelText('Toggle Dark Mode');
    expect(themeButton).toBeInTheDocument();
  });
});
