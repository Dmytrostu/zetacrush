import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookUpload, ChatMessage, SummaryDisplay } from '../components';
import { useAppContext } from '../state/context';
import { UploadHistoryItem } from '../state/context';
import { booksApi } from '../apis/booksApi';

interface Message {
  id: string;
  isUser: boolean;
  content: React.ReactNode | string;
}

const Dashboard: React.FC = () => {  const { 
    user, 
    uploadHistory, 
    setUploadHistory, 
    activeSession, 
    isNewSession, 
    setActiveSession 
  } = useAppContext();
  
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      isUser: false,
      content: (
        <div>
          <h2 style={{ marginBottom: '16px' }}>Welcome to Zetacrush</h2>
          <p style={{ marginBottom: '8px' }}>Upload a book to get started. I'll provide:</p>
          <ul style={{ listStyleType: 'disc', paddingLeft: '20px', marginBottom: '16px' }}>
            <li>Main characters</li>
            <li>Synopsis</li>
            <li>Easter eggs</li>
          </ul>
          <p>Supported formats: PDF, TXT, DOC, DOCX</p>
        </div>
      )
    }
  ]);
  const chatThreadRef = useRef<HTMLDivElement>(null);

  // Load session data when activeSession changes
  useEffect(() => {
    if (activeSession) {
      // Find the selected session from history
      const selectedSession = uploadHistory.find(item => item.id === activeSession);
      
      if (selectedSession) {
        // Reset messages and display selected session data using SummaryDisplay component
        setMessages([
          {
            id: 'session-content',
            isUser: false,
            content: <SummaryDisplay session={selectedSession} />
          }
        ]);
      }
    } else if (isNewSession) {
      // Reset to welcome message when new session is selected
      setMessages([
        {
          id: 'welcome',
          isUser: false,
          content: (
            <div>
              <h2 style={{ marginBottom: '16px' }}>Welcome to Zetacrush</h2>
              <p style={{ marginBottom: '8px' }}>Upload a book to get started. I'll provide:</p>
              <ul style={{ listStyleType: 'disc', paddingLeft: '20px', marginBottom: '16px' }}>
                <li>Main characters</li>
                <li>Synopsis</li>
                <li>Easter eggs</li>
              </ul>
              <p>Supported formats: PDF, TXT, DOC, DOCX</p>
            </div>
          )
        }
      ]);
    }
  }, [activeSession, isNewSession, uploadHistory]);

  // Add user authentication status to welcome message
  useEffect(() => {
    if (isNewSession && !activeSession) {
      setMessages([
        {
          id: 'welcome',
          isUser: false,
          content: (
            <div>
              <h2 style={{ marginBottom: '16px' }}>Welcome to Zetacrush</h2>
              <p style={{ marginBottom: '8px' }}>Upload a book to get started. I'll provide:</p>
              <ul style={{ listStyleType: 'disc', paddingLeft: '20px', marginBottom: '16px' }}>
                <li>Main characters</li>
                <li>Synopsis</li>
                <li>Easter eggs</li>
              </ul>
              <p>Supported formats: PDF, TXT, DOC, DOCX</p>
              {!user && (
                <div style={{ marginTop: '16px', padding: '12px', backgroundColor: 'rgba(16, 163, 127, 0.1)', borderRadius: '6px' }}>
                  <p><strong>Note:</strong> You'll need to sign in to upload books.</p>
                </div>
              )}
            </div>
          )
        }
      ]);
    }
  }, [user, isNewSession, activeSession]);

  const handleUpload = async (file: File) => {
    // Check if user is authenticated
    if (!user) {
      // Save the current path to redirect back after login
      navigate('/signin', { state: { message: "Please sign in to upload books", from: "/" } });
      return;
    }
    
    setLoading(true);
    setError(null);
    
    // Add user message showing the uploaded file
    const userMessageId = Date.now().toString();
    setMessages(prev => [...prev, {
      id: userMessageId,
      isUser: true,
      content: `Uploaded: ${file.name} (${(file.size / 1024).toFixed(1)} KB)`
    }]);
    
    try {
      // Add a processing message
      const processingId = `processing-${Date.now()}`;
      setMessages(prev => [...prev, {
        id: processingId,
        isUser: false,
        content: 'Processing your book... This may take a moment.'
      }]);
      
      // Use the booksApi service which already handles authentication
      const response = await booksApi.uploadBook(file);
        // Remove the processing message
      setMessages(prev => prev.filter(m => m.id !== processingId));
      
      // Add the summary response from the API (response is directly the BookSummary)
      const { characters, synopsis, easterEgg } = response;
      
      // Add to upload history in context for sidebar display
      const newHistoryItem: UploadHistoryItem = {
        id: Date.now().toString(),
        filename: file.name.replace(/\.[^/.]+$/, ""), // Remove file extension
        date: new Date().toISOString(),
        summary: { characters, synopsis, easterEgg }
      };
      
      // Update history and set this as the active session
      setUploadHistory([newHistoryItem, ...uploadHistory]);
      setActiveSession(newHistoryItem.id);
      
      // Display the summary using SummaryDisplay
      setMessages(prev => [...prev.filter(m => !m.id.includes('processing')), {
        id: Date.now().toString(),
        isUser: false,
        content: <SummaryDisplay session={newHistoryItem} />
      }]);
    } catch (err: any) {
      console.error('Upload error:', err);
      
      // Check if this is an authentication error
      if (err?.response?.status === 401 || err?.response?.status === 403) {
        // Authentication failed - token may be expired
        navigate('/signin', { state: { message: "Your session has expired. Please sign in again.", from: "/" } });
      } else {
        // Other types of errors
        setError(err?.response?.data?.detail || 'Failed to summarize book.');
        // Add error message to chat
        setMessages(prev => [...prev, {
          id: Date.now().toString(),
          isUser: false,
          content: `Error: ${err?.response?.data?.detail || 'Failed to summarize book. Please try again.'}`
        }]);
      }
    } finally {
      setLoading(false);
    }
  };
  
  // Auto-scroll to the bottom when messages change
  useEffect(() => {
    if (chatThreadRef.current) {
      chatThreadRef.current.scrollTop = chatThreadRef.current.scrollHeight;
    }
  }, [messages]);
  return (
    <div className="main-container">
      <div className="chat-thread" ref={chatThreadRef}>
        {messages.map(message => (
          <ChatMessage 
            key={message.id}
            isUser={message.isUser} 
            content={message.content}
          />
        ))}
      </div>
      
      <div className="action-bar">
        {isNewSession && (
          <BookUpload onUpload={handleUpload} loading={loading} error={error} />
        )}
      </div>
    </div>
  );
};

export default Dashboard;
