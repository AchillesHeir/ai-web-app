import { render, screen } from '@testing-library/react';
import App from '../App';

test('renders chat component', () => {
  render(<App />);
  const inputElement = screen.getByPlaceholderText(/Type your message.../i);
  expect(inputElement).toBeInTheDocument();
});
