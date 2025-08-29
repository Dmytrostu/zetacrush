import React from 'react';
import './SummaryCard.css';

interface SummaryCardProps {
  characters: string[];
  synopsis: string;
  easterEgg: string;
}

const SummaryCard: React.FC<SummaryCardProps> = ({ characters, synopsis, easterEgg }) => (
  <div className="summary-card-gpt">
    <h2 className="gpt-title">Main Characters</h2>
    <ul className="gpt-list">
      {characters.map((char, idx) => (
        <li key={idx}>{char}</li>
      ))}
    </ul>
    <h2 className="gpt-title">Synopsis</h2>
    <p className="gpt-synopsis">{synopsis}</p>
    <h2 className="gpt-title">Easter Egg</h2>
    <p className="gpt-easter">{easterEgg}</p>
  </div>
);

export default SummaryCard;
