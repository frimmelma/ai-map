import React, { useState } from 'react';
import '../styles/ComplexTaskModal.css';
import { breakdownTask, hasApiKey } from '../services/aiService';

function ComplexTaskModal({ isOpen, onClose, onTasksCreated, onLocationTasksCreated }) {
  const [complexTask, setComplexTask] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!complexTask.trim()) {
      setError('Zadejte popis úkolu');
      return;
    }

    if (!hasApiKey()) {
      setError('Nejprve nastavte OpenAI API klíč');
      return;
    }

    setIsProcessing(true);
    setError('');

    try {
      const subtasks = await breakdownTask(complexTask);

      if (subtasks && subtasks.length > 0) {
        // Add IDs and timestamps to subtasks
        const formattedSubtasks = subtasks.map((subtask, index) => {
          // Create a properly formatted subtask object
          const formattedSubtask = {
            id: Date.now() + index, // Use index to ensure unique IDs
            text: subtask.text || 'Úkol',
            duration: parseInt(subtask.duration) || 30,
            completed: false,
            createdAt: new Date().toISOString(),
            location: subtask.location || null,
            requires_travel: subtask.requires_travel || false
          };

          console.log(`Formatted subtask ${index}:`, formattedSubtask);
          alert(`Dílčí úkol ${index}: ${formattedSubtask.text}`);
          return formattedSubtask;
        });

        // Identify location-based tasks but don't filter them out
        const locationTasks = formattedSubtasks.filter(task => task.requires_travel && task.location);

        // Log for debugging
        console.log('Formatted subtasks:', formattedSubtasks);

        // Send all tasks to the task handler
        console.log('Calling onTasksCreated with:', formattedSubtasks);
        alert('Odesílám úkoly do TimeManager: ' + formattedSubtasks.length);
        onTasksCreated(formattedSubtasks);

        // Also send location tasks to the location handler if there are any
        if (locationTasks.length > 0 && onLocationTasksCreated) {
          console.log('Location tasks:', locationTasks);
          alert('Odesílám lokace: ' + locationTasks.length);
          onLocationTasksCreated(locationTasks);
        }

        setComplexTask('');
        onClose();
      } else {
        setError('Nepodařilo se rozdělit úkol na dílčí úkoly. Zkuste to prosím znovu.');
      }
    } catch (err) {
      console.error('Error processing complex task:', err);
      setError('Nastala chyba při zpracování úkolu. Zkontrolujte API klíč a zkuste to znovu.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content complex-task-modal">
        <div className="modal-header">
          <h2>Rozdělit komplexní úkol</h2>
          <button className="close-button" onClick={onClose}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <div className="modal-body">
          <p>
            Zadejte komplexní úkol a AI ho rozdělí na menší dílčí úkoly, které budou automaticky naplánovány v časovém rozvrhu.
            Pokud úkol obsahuje místa k navštívení, budou automaticky zobrazena na mapě.
          </p>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="complexTask">Popis komplexního úkolu</label>
              <textarea
                id="complexTask"
                value={complexTask}
                onChange={(e) => setComplexTask(e.target.value)}
                placeholder="Např. Připravit prezentaci pro klienta..."
                rows={5}
                className={error ? 'error' : ''}
              />
              {error && <div className="error-message">{error}</div>}
            </div>

            <div className="examples">
              <h3>Příklady komplexních úkolů:</h3>
              <ul>
                <li>Připravit prezentaci pro klienta o novém produktu</li>
                <li>Zorganizovat týmový výlet na příští měsíc</li>
                <li>Nakoupit potraviny a vyzvednout balíček na poště</li>
                <li>Naplánovat cestu do Prahy včetně návštěvy muzea</li>
              </ul>
            </div>
          </form>
        </div>

        <div className="modal-footer">
          <button className="cancel-button" onClick={onClose}>Zrušit</button>
          <button
            className="process-button"
            onClick={handleSubmit}
            disabled={isProcessing || !complexTask.trim()}
          >
            {isProcessing ? (
              <>
                <span className="spinner"></span>
                Zpracovávám...
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                  <path d="M8 14h.01"></path>
                  <path d="M12 14h.01"></path>
                  <path d="M16 14h.01"></path>
                  <path d="M8 18h.01"></path>
                  <path d="M12 18h.01"></path>
                  <path d="M16 18h.01"></path>
                </svg>
                Rozdělit a automaticky naplánovat
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ComplexTaskModal;
