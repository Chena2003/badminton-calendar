import { render, screen } from '@testing-library/react';
import Layout from '../Layout';
import { UserContextProvider } from '../../UserContext';

// Mock child components
vi.mock('components/TopBar/TopBar', () => ({
  default: () => <div data-testid="topbar">TopBar</div>,
}));

vi.mock('components/Header/Header', () => ({
  default: ({ showCTABar, year }: any) => (
    <div data-testid="header">Header {year}</div>
  ),
}));

vi.mock('components/Footer/Footer', () => ({
  default: ({ config }: any) => <div data-testid="footer">Footer</div>,
}));

function renderLayout(children: React.ReactNode = <div>Test Content</div>) {
  return render(
    <UserContextProvider>
      <Layout showCTABar={false} year={2025} config={{}}>
        {children}
      </Layout>
    </UserContextProvider>,
  );
}

describe('Layout', () => {
  it('renders children content', () => {
    renderLayout(<div>My Child Content</div>);
    expect(screen.getByText('My Child Content')).toBeInTheDocument();
  });

  it('includes Header', () => {
    renderLayout();
    expect(screen.getByTestId('header')).toBeInTheDocument();
  });

  it('includes Footer', () => {
    renderLayout();
    expect(screen.getByTestId('footer')).toBeInTheDocument();
  });
});
