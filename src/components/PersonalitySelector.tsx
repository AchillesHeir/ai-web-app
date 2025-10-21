import React from 'react';

export interface Personality {
  name: string;
  image: string;
}

interface PersonalitySelectorProps {
  personalities: Personality[];
  selectedPersonality: string;
  onPersonalityChange: (personalityName: string) => void;
}

const PersonalitySelector: React.FC<PersonalitySelectorProps> = ({
  personalities,
  selectedPersonality,
  onPersonalityChange,
}) => {
  return (
    <div className='personality-container'>
      {personalities.map((person) => {
        const isSelected = selectedPersonality === person.name;
        return (
          <button
            key={person.name}
            onClick={() => onPersonalityChange(person.name)}
            className={`personality-card ${isSelected ? 'selected' : ''}`}
          >
            <img
              src={person.image}
              alt={person.name}
              className='personality-image'
            />
            <span>{person.name}</span>
          </button>
        );
      })}
    </div>
  );
};

export default PersonalitySelector;
