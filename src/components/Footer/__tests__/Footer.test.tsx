import { render, screen } from '@testing-library/react';
import Footer from '../Footer';
import { UserContextProvider } from '../../UserContext';

// Mock child components that are not relevant to Footer tests
vi.mock('../../LanguageSelector/LanguageSelector', () => ({
  default: () => <div data-testid="language-selector">LanguageSelector</div>,
}));

vi.mock('../../SiteSelector/SiteSelector', () => ({
  default: () => <div data-testid="site-selector">SiteSelector</div>,
}));

vi.mock('../../YearSelector/YearSelector', () => ({
  default: () => <div data-testid="year-selector">YearSelector</div>,
}));

vi.mock('../../SupportButton/SupportButton', () => ({
  default: () => <div data-testid="support-button">SupportButton</div>,
}));

vi.mock('../../Icons/EmailIcon', () => ({
  default: () => <svg data-testid="email-icon" />,
}));

vi.mock('../../Icons/GitHubIcon', () => ({
  default: ({ className }: any) => <svg data-testid="github-icon" className={className} />,
}));

function renderFooter(config: any = {}) {
  return render(
    <UserContextProvider>
      <Footer config={config} />
    </UserContextProvider>,
  );
}

describe('Footer', () => {
  it('renders Made by Chena', () => {
    renderFooter();
    expect(screen.getByText('Made by Chena')).toBeInTheDocument();
  });

  it('renders GitHub link', () => {
    renderFooter();
    const githubLink = screen.getByLabelText('GitHub Profile');
    expect(githubLink).toBeInTheDocument();
    expect(githubLink).toHaveAttribute('href', 'https://github.com/Chena2003');
  });

  it('renders Years and Timezones links', () => {
    renderFooter();
    expect(screen.getByText('Years')).toBeInTheDocument();
    expect(screen.getByText('Timezones')).toBeInTheDocument();
  });

  it('does not show home screen prompt on non-iOS', () => {
    // Default jsdom navigator does not have standalone and is not iOS
    renderFooter({ supportsWebPush: true });
    // The modal should not appear
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});
