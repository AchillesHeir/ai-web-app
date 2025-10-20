import React from 'react';

interface PersonalitySelectorProps {
  personalities: string[];
  selectedPersonality: string;
  onPersonalityChange: (personality: string) => void;
}

const PersonalitySelector: React.FC<PersonalitySelectorProps> = ({
  personalities,
  selectedPersonality,
  onPersonalityChange,
}) => {
  return (
    <select
      value={selectedPersonality}
      onChange={(e) => onPersonalityChange(e.target.value)}
    >
      {personalities.map((p) => (
        <option key={p} value={p}>
          {p}
        </option>
      ))}
    </select>
  );
};

export default PersonalitySelector;
