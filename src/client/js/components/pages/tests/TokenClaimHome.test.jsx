import React from 'react';
import { render, screen } from '@testing-library/react';
import TokenClaimHome from '../TokenClaimHome';
import { BrowserRouter } from 'react-router-dom';

describe('<TokenClaimHome />', () => {
  it('Render Title from Token Claim component', () => {
    render(
      <BrowserRouter>
        <TokenClaimHome />
      </BrowserRouter>,
    );

    const Title = screen.getByText(/Token Claim/i);

    expect(Title).toBeInTheDocument();
  });
});
