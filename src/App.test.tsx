import { render, screen } from '@testing-library/react';
import App from './App';

test('Nussinov text', () => {
  render(<App />);
  const element = screen.getByText(/Nussinov/i);
  expect(element).toBeInTheDocument();
});
