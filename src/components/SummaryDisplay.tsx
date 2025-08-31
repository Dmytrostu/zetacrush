import React from 'react';
import { UploadHistoryItem } from '../state/context';
import './SummaryDisplay.css';

interface SummaryDisplayProps {
  session: UploadHistoryItem;
}

const SummaryDisplay: React.FC<SummaryDisplayProps> = ({ session }) => {
  return (
    <div className="summary-display">
      <div className="summary-section">
        <h2 className="summary-header">{session.filename}</h2>
        <div className="session-metadata">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2Z" 
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 6V12L16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Viewed on {new Date(session.date).toLocaleString()}
        </div>
        
        <h3 className="summary-section-title">Main Characters</h3>
        <div className="summary-characters">
          {session.summary.characters.map((char, index) => (
            <span key={index} className="character-tag">{char}</span>
          ))}
        </div>
        
        <h3 className="summary-section-title">Synopsis</h3>
        <div className="synopsis-container">
          <pre className="synopsis-text">{session.summary.synopsis}</pre>
        </div>
        
        <div className="easter-egg-container">
          <h3 className="easter-egg-title">Easter Egg</h3>
          <p className="easter-egg-text">{session.summary.easterEgg}</p>
        </div>
      </div>
    </div>
  );
};

export default SummaryDisplay;
