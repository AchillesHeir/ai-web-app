import { render, screen } from '@testing-library/react';
import Message from './Message';

test('renders user message', () => {
  const message = { role: 'user' as const, content: 'Hello' };
  render(<Message message={message} />);
  const messageElement = screen.getByText('Hello');
  expect(messageElement).toBeInTheDocument();
  expect(messageElement).toHaveClass('message user');
});

test('renders assistant message', () => {
  const message = { role: 'assistant' as const, content: 'Hi there!' };
  render(<Message message={message} />);
  const messageElement = screen.getByText('Hi there!');
  expect(messageElement).toBeInTheDocument();
  expect(messageElement).toHaveClass('message assistant');
});
