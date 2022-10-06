import { render, screen } from '@testing-library/react';
import App from './Tree';

test('renders tree link', () => {
  render(<App />);
  const linkElement = screen.getByText(/Tree/i);
  expect(linkElement).toBeInTheDocument();
});
