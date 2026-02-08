import { render, screen } from '@testing-library/react';
import NextBadge from '../NextBadge';
import TBCBadge from '../TBCBadge';
import CanceledBadge from '../CanceledBadge';

describe('NextBadge', () => {
  it('renders correct text', () => {
    render(<NextBadge />);
    expect(screen.getByText('badges.next')).toBeInTheDocument();
  });
});

describe('TBCBadge', () => {
  it('renders correct text', () => {
    render(<TBCBadge />);
    // TBCBadge renders the text in the span content
    expect(screen.getByText('badges.tbc')).toBeInTheDocument();
  });
});

describe('CanceledBadge', () => {
  it('renders correct text', () => {
    render(<CanceledBadge />);
    expect(screen.getByText('badges.canceled')).toBeInTheDocument();
  });
});
