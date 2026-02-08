import { render, RenderOptions } from '@testing-library/react';
import { ReactElement } from 'react';
import { UserContextProvider } from '../../components/UserContext';

function renderWithProviders(
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) {
  function Wrapper({ children }: { children: React.ReactNode }) {
    return <UserContextProvider>{children}</UserContextProvider>;
  }

  return render(ui, { wrapper: Wrapper, ...options });
}

export default renderWithProviders;
