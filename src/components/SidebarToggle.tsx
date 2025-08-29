import React from 'react';
import { useAppContext } from '../state/context';
import './SidebarToggle.css';

const SidebarToggle: React.FC = () => {
  const { sidebarOpen, setSidebarOpen } = useAppContext();

  // Since sidebar is now open by default, this button will toggle it closed/open
  return (
    <button 
      className={`sidebar-toggle ${sidebarOpen ? 'active' : ''}`}
      onClick={() => setSidebarOpen(!sidebarOpen)}
    >
      <span className="bar"></span>
      <span className="bar"></span>
      <span className="bar"></span>
    </button>
  );
};

export default SidebarToggle;
