import { test, expect, afterEach } from 'vitest';
import { cleanup, screen } from '@testing-library/react';
import { Warning } from './WarningMessageWithIcon';
import { renderWithRouter } from 'libs/testing-library';

afterEach(async () => {
  cleanup(); // Clear the screen after each test
  window.history.replaceState(null, 'root', '/');
});

const component = () => {
  return (
    <Warning htmlFor="" message="" className="" isError={true}>
      Example warning
    </Warning>
  );
};

test('Test warning component', async () => {
  // ARRANGE
  await renderWithRouter({ component });

  // ACT

  // ASSERT
  expect(window.location.pathname).toBe('/');
  expect(screen.getByText('Example warning')).toBeInTheDocument();
});
