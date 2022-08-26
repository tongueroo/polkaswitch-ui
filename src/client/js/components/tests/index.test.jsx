import React from 'react';
import { render, screen } from '@testing-library/react';
import App from '../App';

describe('<App />', () => {
  it('Render swap Text', () => {
    render(<App />);

    const linkElement = screen.getByText(/Cross Chain Swap/i);

    expect(linkElement).toBeInTheDocument();
  });
});
