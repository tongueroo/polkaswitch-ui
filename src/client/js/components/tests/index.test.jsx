import React from 'react';
import { render, screen } from '@testing-library/react';
import App from '../App';

describe('<App />', () => {
  it('Render you pay from Swap Trade', () => {
    render(<App />);

    const linkElement = screen.getByText(/You Pay/i);

    expect(linkElement).toBeInTheDocument();
  });
});
