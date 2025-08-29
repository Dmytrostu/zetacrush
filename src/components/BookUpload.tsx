import React from 'react';
import { useAppContext } from '../state/context';
import { AuthPrompt } from './';
import './BookUpload.css';

interface BookUploadProps {
  onUpload: (file: File) => void;
  loading: boolean;
  error: string | null;
}

const BookUpload: React.FC<BookUploadProps> = ({ onUpload, loading, error }) => {
  const { user } = useAppContext();
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onUpload(e.target.files[0]);
    }
  };
  // If user is not authenticated, show auth prompt instead of upload button
  if (!user) {
    return <AuthPrompt message="Please sign in to upload books" />;
  }

  return (
    <div className="book-upload-gpt">
      <div>
        <input
          type="file"
          accept=".pdf,.txt,.doc,.docx"
          ref={fileInputRef}
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />
        <button
          className="gpt-btn"
          onClick={() => fileInputRef.current?.click()}
          disabled={loading}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 5V19M19 12L5 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          {loading ? 'Uploading...' : 'Upload Book'}
        </button>
      </div>
      {error && <div className="gpt-error">{error}</div>}
      <div className="upload-helper-text">Supported formats: PDF, TXT, DOC, DOCX</div>
    </div>
  );
};

export default BookUpload;
