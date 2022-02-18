import React from 'react';
import { render, screen } from '@testing-library/react';
import StakeHome from '../StakeHome';
import { BrowserRouter } from 'react-router-dom';

describe('<StakeHome />', () => {
  it('Render title from StakeHome Component', () => {
    render(
      <BrowserRouter>
        <StakeHome />
      </BrowserRouter>,
    );

    const Title = screen.getByText(/Bridge Assets/i);

    expect(Title).toBeInTheDocument();
  });
});
