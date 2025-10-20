import { render, screen, fireEvent } from '@testing-library/react';
import Chat from './Chat';

test('renders chat component and sends a message', async () => {
  render(<Chat />);
  const inputElement = screen.getByPlaceholderText(/Type your message.../i);
  const sendButton = screen.getByText(/Send/i);

  fireEvent.change(inputElement, { target: { value: 'Hello' } });
  fireEvent.click(sendButton);

  const userMessage = await screen.findByText('Hello');
  expect(userMessage).toBeInTheDocument();

  const aiResponse = await screen.findByText(/This is a mock response from/i);
  expect(aiResponse).toBeInTheDocument();
});
