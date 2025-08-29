import React, { useEffect } from 'react';
import { useAppContext } from '../../state/context';
import './Sidebar.css';

const Sidebar: React.FC = () => {
  const { 
    sidebarOpen, 
    setSidebarOpen, 
    user, 
    uploadHistory, 
    activeSession, 
    setActiveSession,
    setIsNewSession
  } = useAppContext();

  const handleNewBook = () => {
    setActiveSession(null);
    setIsNewSession(true);
  };

  const handleSessionClick = (sessionId: string) => {
    setActiveSession(sessionId);
    setIsNewSession(false);
  };

  // Add keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only handle keyboard if sidebar is open
      if (!sidebarOpen) return;
      
      if (e.key === 'n' && (e.altKey)) {
        // Alt+N or Cmd+N for new book
        e.preventDefault();
        handleNewBook();
      } else if (uploadHistory && uploadHistory.length > 0) {
        // Arrow keys to navigate between sessions
        const currentIndex = activeSession 
          ? uploadHistory.findIndex(item => item.id === activeSession) 
          : -1;
        
        if (e.key === 'ArrowUp' && currentIndex > 0) {
          // Move up in list (to more recent session)
          e.preventDefault();
          handleSessionClick(uploadHistory[currentIndex - 1].id);
        } else if (e.key === 'ArrowDown' && currentIndex < uploadHistory.length - 1 && currentIndex !== -1) {
          // Move down in list (to older session)
          e.preventDefault();
          handleSessionClick(uploadHistory[currentIndex + 1].id);
        } else if (e.key === 'ArrowDown' && currentIndex === -1 && uploadHistory.length > 0) {
          // If no session selected and arrow down, select the first session
          e.preventDefault();
          handleSessionClick(uploadHistory[0].id);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [sidebarOpen, activeSession, uploadHistory]);

  return (
    <aside className={`sidebar${sidebarOpen ? ' open' : ''}`}>  
      <div className="sidebar-header">
        <button className="hamburger" onClick={() => setSidebarOpen(!sidebarOpen)}>
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </button>
        <h2>Zetacrush</h2>
      </div>
      
      <div className="sidebar-actions">
        <button className="sidebar-new-chat" onClick={handleNewBook}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 5V19M19 12L5 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          New book
        </button>
      </div>
      
      <div className="sidebar-section-header">
        <span>Recent sessions</span>
      </div>
      
      <nav className="sidebar-nav">
        {uploadHistory && uploadHistory.length > 0 ? (
          <ul className="sessions-list">
            {uploadHistory.map(item => (
              <li 
                key={item.id} 
                className={`session-item${activeSession === item.id ? ' active' : ''}`}
                onClick={() => handleSessionClick(item.id)}
              >
                <div className="session-icon">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6 2h12a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z" stroke="currentColor" strokeWidth="2"/>
                    <path d="M8 6h8M8 10h8M8 14h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </div>
                <div className="session-title">{item.filename}</div>
                <div className="session-date">{new Date(item.date).toLocaleDateString()}</div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="no-sessions">
            <p>No book sessions yet</p>
          </div>
        )}
      </nav>
        <div className="sidebar-footer">
        <div className="keyboard-shortcuts">
          <div className="shortcut-title">Keyboard shortcuts</div>
          <div className="shortcut-item">
            <span className="shortcut-key">Alt+N</span>
            <span className="shortcut-desc">New book</span>
          </div>
          <div className="shortcut-item">
            <span className="shortcut-key">↑ ↓</span>
            <span className="shortcut-desc">Navigate sessions</span>
          </div>
        </div>
        {user ? <span className="user-info">Signed in as {user.email}</span> : <span className="user-info">Not signed in</span>}
      </div>
    </aside>
  );
};

export default Sidebar;
