import React, { useState, useEffect } from 'react';
import '../styles/ApiKeyModal.css';
import { getApiKey, setApiKey } from '../services/aiService';

function ApiKeyModal({ isOpen, onClose }) {
  const [apiKey, setApiKeyState] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const currentKey = getApiKey();
      setApiKeyState(currentKey || '');
      setError('');
      setSuccess(false);
    }
  }, [isOpen]);

  const handleSave = () => {
    if (!apiKey.trim()) {
      setError('API klíč je povinný');
      return;
    }

    setIsSaving(true);
    setError('');

    try {
      setApiKey(apiKey.trim());
      setSuccess(true);
      setIsSaving(false);
      
      // Close modal after a short delay
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err) {
      setError('Nepodařilo se uložit API klíč');
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Nastavení OpenAI API klíče</h2>
          <button className="close-button" onClick={onClose}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        
        <div className="modal-body">
          <p>
            Pro využití AI funkcí pro odhad času a plánování je potřeba zadat OpenAI API klíč.
            Klíč můžete získat na <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer">OpenAI platformě</a>.
          </p>
          
          <div className="form-group">
            <label htmlFor="apiKey">OpenAI API klíč</label>
            <input
              type="text"
              id="apiKey"
              value={apiKey}
              onChange={(e) => setApiKeyState(e.target.value)}
              placeholder="sk-..."
              className={error ? 'error' : ''}
            />
            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">API klíč byl úspěšně uložen!</div>}
          </div>
        </div>
        
        <div className="modal-footer">
          <button className="cancel-button" onClick={onClose}>Zrušit</button>
          <button 
            className="save-button" 
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? 'Ukládám...' : 'Uložit klíč'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ApiKeyModal;
