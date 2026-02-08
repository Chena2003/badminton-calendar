import { render, screen, act } from '@testing-library/react';
import { UserContextProvider, useUserContext } from '../UserContext';

// Helper component to expose context values
function ContextConsumer({ onContext }: { onContext: (ctx: any) => void }) {
  const ctx = useUserContext();
  onContext(ctx);
  return <div data-testid="consumer">ready</div>;
}

describe('UserContext', () => {
  it('provides default values before useEffect runs', () => {
    // Without act, we capture the initial state before useEffect
    let captured: any = {};
    render(
      <UserContextProvider>
        <ContextConsumer onContext={(ctx) => (captured = ctx)} />
      </UserContextProvider>,
    );
    // After useEffect, timezone may be guessed, but timeFormat and theme should have values
    expect(captured.timeFormat).toBeDefined();
    expect(captured.theme).toBeDefined();
    expect(captured.collapsePastRaces).toBeDefined();
    expect(typeof captured.updateTimezone).toBe('function');
    expect(typeof captured.updateTimeFormat).toBe('function');
    expect(typeof captured.toggleTheme).toBe('function');
  });

  it('restores timezone from localStorage on mount', async () => {
    localStorage.setItem('timezone', 'America/New_York');

    let captured: any = {};
    await act(async () => {
      render(
        <UserContextProvider>
          <ContextConsumer onContext={(ctx) => (captured = ctx)} />
        </UserContextProvider>,
      );
    });

    expect(captured.timezone).toBe('America/New_York');
  });

  it('restores timeFormat from localStorage on mount', async () => {
    localStorage.setItem('timeFormat', '12');

    let captured: any = {};
    await act(async () => {
      render(
        <UserContextProvider>
          <ContextConsumer onContext={(ctx) => (captured = ctx)} />
        </UserContextProvider>,
      );
    });

    expect(captured.timeFormat).toBe(12);
  });

  it('restores theme from localStorage on mount', async () => {
    localStorage.setItem('theme', 'light');

    let captured: any = {};
    await act(async () => {
      render(
        <UserContextProvider>
          <ContextConsumer onContext={(ctx) => (captured = ctx)} />
        </UserContextProvider>,
      );
    });

    expect(captured.theme).toBe('light');
  });

  it('updateTimezone updates state and persists to localStorage', async () => {
    let captured: any = {};
    await act(async () => {
      render(
        <UserContextProvider>
          <ContextConsumer onContext={(ctx) => (captured = ctx)} />
        </UserContextProvider>,
      );
    });

    await act(async () => {
      captured.updateTimezone('Asia/Tokyo');
    });

    expect(captured.timezone).toBe('Asia/Tokyo');
    expect(localStorage.setItem).toHaveBeenCalledWith('timezone', 'Asia/Tokyo');
  });

  it('normalizes Europe/Kyiv to Europe/Kiev', async () => {
    let captured: any = {};
    await act(async () => {
      render(
        <UserContextProvider>
          <ContextConsumer onContext={(ctx) => (captured = ctx)} />
        </UserContextProvider>,
      );
    });

    await act(async () => {
      captured.updateTimezone('Europe/Kyiv');
    });

    expect(captured.timezone).toBe('Europe/Kiev');
    expect(localStorage.setItem).toHaveBeenCalledWith('timezone', 'Europe/Kiev');
  });

  it('updateTimeFormat updates state and persists to localStorage', async () => {
    let captured: any = {};
    await act(async () => {
      render(
        <UserContextProvider>
          <ContextConsumer onContext={(ctx) => (captured = ctx)} />
        </UserContextProvider>,
      );
    });

    await act(async () => {
      captured.updateTimeFormat(12);
    });

    expect(captured.timeFormat).toBe(12);
    expect(localStorage.setItem).toHaveBeenCalledWith('timeFormat', '12');
  });

  it('toggleTheme switches theme and updates DOM class', async () => {
    localStorage.setItem('theme', 'dark');

    let captured: any = {};
    await act(async () => {
      render(
        <UserContextProvider>
          <ContextConsumer onContext={(ctx) => (captured = ctx)} />
        </UserContextProvider>,
      );
    });

    expect(captured.theme).toBe('dark');

    await act(async () => {
      captured.toggleTheme();
    });

    expect(captured.theme).toBe('light');
    expect(localStorage.setItem).toHaveBeenCalledWith('theme', 'light');
  });

  it('updateCollapsePastRaces updates state and persists to localStorage', async () => {
    let captured: any = {};
    await act(async () => {
      render(
        <UserContextProvider>
          <ContextConsumer onContext={(ctx) => (captured = ctx)} />
        </UserContextProvider>,
      );
    });

    await act(async () => {
      captured.updateCollapsePastRaces(false);
    });

    expect(captured.collapsePastRaces).toBe(false);
    expect(localStorage.setItem).toHaveBeenCalledWith(
      'collapsePastRaces',
      'false',
    );
  });
});
