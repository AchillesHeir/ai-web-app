import { render, screen, fireEvent } from '@testing-library/react';
import PersonalitySelector from './PersonalitySelector';

test('renders personality selector and changes personality', () => {
  const personalities = ['Cal', 'Tiffany'];
  let selectedPersonality = 'Cal';
  const onPersonalityChange = (personality: string) => {
    selectedPersonality = personality;
  };

  render(
    <PersonalitySelector
      personalities={personalities}
      selectedPersonality={selectedPersonality}
      onPersonalityChange={onPersonalityChange}
    />
  );

  const selectElement = screen.getByRole('combobox');
  expect(selectElement).toHaveValue('Cal');

  fireEvent.change(selectElement, { target: { value: 'Tiffany' } });
  expect(selectedPersonality).toBe('Tiffany');
});
