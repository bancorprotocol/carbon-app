import React from 'react';
import { render, screen } from '@testing-library/react';

test('renders learn react link', () => {
  render(<div>Hello</div>);
  const linkElement = screen.getByText(/Hello/i);
  expect(linkElement).toBeInTheDocument();
});
