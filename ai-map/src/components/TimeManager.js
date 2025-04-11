import React, { useState, useEffect } from 'react';
import '../styles/TimeManager.css';
import ApiKeyModal from './ApiKeyModal';
import ScheduleView from './ScheduleView';
import ComplexTaskModal from './ComplexTaskModal';
import { estimateTaskDuration, generateSchedule, hasApiKey } from '../services/aiService';

function TimeManager({ onLocationTasks }) {
  const [tasks, setTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [freeTimeActivities, setFreeTimeActivities] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [newTaskDuration, setNewTaskDuration] = useState('');
  const [newFreeTimeActivity, setNewFreeTimeActivity] = useState('');
  const [currentTime, setCurrentTime] = useState('');
  const [countdownTime, setCountdownTime] = useState('');
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  const [isComplexTaskModalOpen, setIsComplexTaskModalOpen] = useState(false);
  const [schedule, setSchedule] = useState([]);
  const [isGeneratingSchedule, setIsGeneratingSchedule] = useState(false);
  const [isEstimatingDuration, setIsEstimatingDuration] = useState(false);

  // Initialize from localStorage if available
  useEffect(() => {
    const storedTasks = localStorage.getItem('tasks');
    const storedCompletedTasks = localStorage.getItem('completedTasks');
    const storedFreeTimeActivities = localStorage.getItem('freeTimeActivities');
    const storedSchedule = localStorage.getItem('schedule');

    if (storedTasks) {
      try {
        const parsedTasks = JSON.parse(storedTasks);
        console.log('Loaded tasks from localStorage:', parsedTasks);
        setTasks(parsedTasks);
      } catch (error) {
        console.error('Error parsing tasks from localStorage:', error);
      }
    }

    if (storedCompletedTasks) setCompletedTasks(JSON.parse(storedCompletedTasks));
    if (storedFreeTimeActivities) setFreeTimeActivities(JSON.parse(storedFreeTimeActivities));
    if (storedSchedule) setSchedule(JSON.parse(storedSchedule));

    // Check if API key is set, if not, show the modal
    if (!hasApiKey()) {
      setIsApiKeyModalOpen(true);
    }

    // Set up timer for current time
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(
        `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`
      );

      // Calculate time until Thursday
      const today = now.getDay(); // 0 is Sunday, 4 is Thursday
      const daysUntilThursday = (4 - today + 7) % 7 || 7; // If today is Thursday, we want next Thursday
      const thursdayDate = new Date(now);
      thursdayDate.setDate(now.getDate() + daysUntilThursday);
      thursdayDate.setHours(0, 0, 0, 0);

      const diffTime = thursdayDate - now;
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      const diffHours = Math.floor((diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const diffMinutes = Math.floor((diffTime % (1000 * 60 * 60)) / (1000 * 60));
      const diffSeconds = Math.floor((diffTime % (1000 * 60)) / 1000);

      setCountdownTime(`${diffDays} dní ${String(diffHours).padStart(2, '0')}:${String(diffMinutes).padStart(2, '0')}:${String(diffSeconds).padStart(2, '0')}`);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Save to localStorage when data changes
  useEffect(() => {
    try {
      console.log('Saving tasks to localStorage:', tasks);
      localStorage.setItem('tasks', JSON.stringify(tasks));
      localStorage.setItem('completedTasks', JSON.stringify(completedTasks));
      localStorage.setItem('freeTimeActivities', JSON.stringify(freeTimeActivities));
      localStorage.setItem('schedule', JSON.stringify(schedule));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }, [tasks, completedTasks, freeTimeActivities, schedule]);

  // Function to estimate task duration using AI
  const handleEstimateDuration = async () => {
    if (!newTask.trim()) return;
    if (!hasApiKey()) {
      setIsApiKeyModalOpen(true);
      return;
    }

    setIsEstimatingDuration(true);
    try {
      const estimatedDuration = await estimateTaskDuration(newTask);
      setNewTaskDuration(estimatedDuration.toString());
    } catch (error) {
      console.error('Error estimating duration:', error);
    } finally {
      setIsEstimatingDuration(false);
    }
  };

  // Function to generate schedule using AI
  const handleGenerateSchedule = async () => {
    if (!hasApiKey()) {
      setIsApiKeyModalOpen(true);
      return;
    }

    // Use the helper function to generate and set the schedule
    await generateAndSetSchedule(tasks, freeTimeActivities);
  };

  const addTask = () => {
    if (newTask.trim() === '') return;

    const task = {
      id: Date.now(),
      text: newTask,
      duration: newTaskDuration ? parseInt(newTaskDuration) : 30,
      completed: false,
      createdAt: new Date().toISOString()
    };

    // Add the new task to the existing tasks
    const newTasks = [...tasks, task];

    // Update state
    setTasks(newTasks);

    // Save to localStorage immediately
    try {
      localStorage.setItem('tasks', JSON.stringify(newTasks));
      console.log('Tasks saved to localStorage after adding new task:', newTasks);
    } catch (error) {
      console.error('Error saving tasks to localStorage:', error);
    }

    setNewTask('');
    setNewTaskDuration('');

    // Regenerate schedule when tasks change
    if (hasApiKey() && tasks.length > 0) {
      handleGenerateSchedule();
    }
  };

  // Handle adding multiple subtasks from complex task breakdown
  const handleAddSubtasks = (subtasks) => {
    console.log('Adding subtasks:', subtasks); // Debug log

    if (!subtasks || subtasks.length === 0) {
      console.error('No subtasks received');
      return;
    }

    // Make sure each subtask has the required properties
    const validSubtasks = subtasks.map(subtask => ({
      ...subtask,
      id: subtask.id || Date.now() + Math.random(),
      text: subtask.text || 'Úkol',
      duration: subtask.duration || 30,
      completed: false,
      createdAt: subtask.createdAt || new Date().toISOString()
    }));

    console.log('Valid subtasks:', validSubtasks);

    // Add the new subtasks to the existing tasks
    const newTasks = [...tasks, ...validSubtasks];

    // Update state
    setTasks(newTasks);

    // Save to localStorage immediately
    try {
      localStorage.setItem('tasks', JSON.stringify(newTasks));
      console.log('Tasks saved to localStorage:', newTasks);
    } catch (error) {
      console.error('Error saving tasks to localStorage:', error);
    }

    // Automatically generate schedule with the new tasks
    if (hasApiKey()) {
      // We're passing the new tasks directly to ensure the schedule includes them
      generateAndSetSchedule(newTasks, freeTimeActivities);
    }
  };

  // Helper function to generate and set schedule
  const generateAndSetSchedule = async (taskList, freeTimeList) => {
    setIsGeneratingSchedule(true);
    try {
      const generatedSchedule = await generateSchedule(taskList, freeTimeList);
      setSchedule(generatedSchedule);
    } catch (error) {
      console.error('Error generating schedule:', error);
    } finally {
      setIsGeneratingSchedule(false);
    }
  };

  // Handle location-based tasks
  const handleLocationTasks = (locationTasks) => {
    // Pass location tasks to parent component
    if (onLocationTasks) {
      onLocationTasks(locationTasks);
    }
  };

  const addFreeTimeActivity = () => {
    if (newFreeTimeActivity.trim() === '') return;

    const activity = {
      id: Date.now(),
      text: newFreeTimeActivity,
      createdAt: new Date().toISOString()
    };

    // Add the new activity to the existing activities
    const newActivities = [...freeTimeActivities, activity];

    // Update state
    setFreeTimeActivities(newActivities);

    // Save to localStorage immediately
    try {
      localStorage.setItem('freeTimeActivities', JSON.stringify(newActivities));
      console.log('Activities saved to localStorage after adding new activity:', newActivities);
    } catch (error) {
      console.error('Error saving activities to localStorage:', error);
    }

    setNewFreeTimeActivity('');

    // Regenerate schedule when activities change
    if (hasApiKey() && freeTimeActivities.length > 0) {
      handleGenerateSchedule();
    }
  };

  const completeTask = (taskId) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    // Create updated task lists
    const updatedCompletedTasks = [...completedTasks, {...task, completedAt: new Date().toISOString()}];
    const updatedTasks = tasks.filter(t => t.id !== taskId);

    // Update state
    setCompletedTasks(updatedCompletedTasks);
    setTasks(updatedTasks);

    // Save to localStorage immediately
    try {
      localStorage.setItem('completedTasks', JSON.stringify(updatedCompletedTasks));
      localStorage.setItem('tasks', JSON.stringify(updatedTasks));
      console.log('Tasks updated in localStorage after completing task');
    } catch (error) {
      console.error('Error saving tasks to localStorage:', error);
    }

    // Regenerate schedule when tasks change
    if (hasApiKey() && updatedTasks.length > 0) {
      handleGenerateSchedule();
    }
  };

  const uncompleteTask = (taskId) => {
    const task = completedTasks.find(t => t.id === taskId);
    if (!task) return;

    const { completedAt, ...taskWithoutCompletedAt } = task;

    // Create updated task lists
    const updatedTasks = [...tasks, taskWithoutCompletedAt];
    const updatedCompletedTasks = completedTasks.filter(t => t.id !== taskId);

    // Update state
    setTasks(updatedTasks);
    setCompletedTasks(updatedCompletedTasks);

    // Save to localStorage immediately
    try {
      localStorage.setItem('tasks', JSON.stringify(updatedTasks));
      localStorage.setItem('completedTasks', JSON.stringify(updatedCompletedTasks));
      console.log('Tasks updated in localStorage after uncompleting task');
    } catch (error) {
      console.error('Error saving tasks to localStorage:', error);
    }

    // Regenerate schedule when tasks change
    if (hasApiKey() && updatedTasks.length > 0) {
      handleGenerateSchedule();
    }
  };

  const deleteTask = (taskId, isCompleted = false) => {
    if (isCompleted) {
      // Create updated completed tasks list
      const updatedCompletedTasks = completedTasks.filter(t => t.id !== taskId);

      // Update state
      setCompletedTasks(updatedCompletedTasks);

      // Save to localStorage immediately
      try {
        localStorage.setItem('completedTasks', JSON.stringify(updatedCompletedTasks));
        console.log('Completed tasks updated in localStorage after deleting task');
      } catch (error) {
        console.error('Error saving completed tasks to localStorage:', error);
      }
    } else {
      // Create updated tasks list
      const updatedTasks = tasks.filter(t => t.id !== taskId);

      // Update state
      setTasks(updatedTasks);

      // Save to localStorage immediately
      try {
        localStorage.setItem('tasks', JSON.stringify(updatedTasks));
        console.log('Tasks updated in localStorage after deleting task');
      } catch (error) {
        console.error('Error saving tasks to localStorage:', error);
      }

      // Regenerate schedule when tasks change
      if (hasApiKey() && updatedTasks.length > 0) {
        handleGenerateSchedule();
      }
    }
  };

  const deleteFreeTimeActivity = (activityId) => {
    // Create updated activities list
    const updatedActivities = freeTimeActivities.filter(a => a.id !== activityId);

    // Update state
    setFreeTimeActivities(updatedActivities);

    // Save to localStorage immediately
    try {
      localStorage.setItem('freeTimeActivities', JSON.stringify(updatedActivities));
      console.log('Activities updated in localStorage after deleting activity');
    } catch (error) {
      console.error('Error saving activities to localStorage:', error);
    }

    // Regenerate schedule when activities change
    if (hasApiKey() && updatedActivities.length > 0) {
      handleGenerateSchedule();
    }
  };

  return (
    <div className="time-manager">
      <div className="time-manager-header">
        <div className="header-title-section">
          <h1>Můj časový manažer</h1>
          <button
            className="complex-task-button"
            onClick={() => setIsComplexTaskModalOpen(true)}
            title="Rozdělit komplexní úkol na menší části"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M8 3H5a2 2 0 0 0-2 2v3"/>
              <path d="M21 8V5a2 2 0 0 0-2-2h-3"/>
              <path d="M3 16v3a2 2 0 0 0 2 2h3"/>
              <path d="M16 21h3a2 2 0 0 0 2-2v-3"/>
              <rect x="7" y="7" width="10" height="10" rx="2"/>
            </svg>
            Komplexní úkol
          </button>
        </div>
        <div className="time-manager-info">
          <div className="location-indicator">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#10b981" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
          </div>
          <div className="countdown-timer">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 22h14"/>
              <path d="M5 2h14"/>
              <path d="M17 22v-4.172a2 2 0 0 0-.586-1.414L12 12l-4.414 4.414A2 2 0 0 0 7 17.828V22"/>
              <path d="M7 2v4.172a2 2 0 0 0 .586 1.414L12 12l4.414-4.414A2 2 0 0 0 17 6.172V2"/>
            </svg>
            <span>Do čtvrtka zbývá: {countdownTime}</span>
            <button className="edit-button">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>
                <path d="m15 5 4 4"/>
              </svg>
            </button>
          </div>
          <div className="current-time">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4f46e5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12 6 12 12 16 14"/>
            </svg>
            <span>{currentTime}</span>
          </div>
          <button className="api-key-button" onClick={() => setIsApiKeyModalOpen(true)}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/>
            </svg>
            API Klíč
          </button>
        </div>
      </div>

      <div className="divider"></div>

      <div className="input-sections">
        <div className="input-section">
          <h2>Nový úkol</h2>
          <div className="input-container">
            <input
              type="text"
              placeholder="Zadejte úkol..."
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addTask()}
            />
            <div className="duration-input-container">
              <input
                type="number"
                placeholder="Min"
                value={newTaskDuration}
                onChange={(e) => setNewTaskDuration(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addTask()}
              />
              <button
                className={`estimate-button ${isEstimatingDuration ? 'loading' : ''}`}
                onClick={handleEstimateDuration}
                disabled={isEstimatingDuration || !newTask.trim()}
                title="Odhadnout čas pomocí AI"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/>
                  <polyline points="12 6 12 12 16 14"/>
                </svg>
              </button>
            </div>
            <button className="add-button blue" onClick={addTask}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" x2="12" y1="5" y2="19"/>
                <line x1="5" x2="19" y1="12" y2="12"/>
              </svg>
            </button>
          </div>
        </div>

        <div className="input-section">
          <h2>Volnočasová aktivita</h2>
          <div className="input-container">
            <input
              type="text"
              placeholder="Např. čtení, sport..."
              value={newFreeTimeActivity}
              onChange={(e) => setNewFreeTimeActivity(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addFreeTimeActivity()}
            />
            <button className="add-button green" onClick={addFreeTimeActivity}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" x2="12" y1="5" y2="19"/>
                <line x1="5" x2="19" y1="12" y2="12"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div className="lists-container">
        <div className="list-section">
          <h3>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 21L7 21"/>
              <path d="M16 17H7"/>
              <path d="M16 13H7"/>
              <path d="M16 9H7"/>
              <path d="M21 7.5L18 10.5L16.5 9"/>
              <path d="M21 15.5L18 18.5L16.5 17"/>
            </svg>
            K dokončení
          </h3>
          <div className="task-list">
            {tasks.length > 0 ? (
              tasks.map(task => (
                <div key={task.id} className="task-item">
                  <div className="task-content">
                    <span className="task-text">{task.text}</span>
                    {task.duration && (
                      <span className="task-duration">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="10"/>
                          <polyline points="12 6 12 12 16 14"/>
                        </svg>
                        {task.duration} min
                      </span>
                    )}
                  </div>
                  <div className="task-actions">
                    <button onClick={() => completeTask(task.id)} className="action-button complete">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                        <polyline points="22 4 12 14.01 9 11.01"/>
                      </svg>
                    </button>
                    <button onClick={() => deleteTask(task.id)} className="action-button delete">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 6h18"/>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                        <line x1="10" x2="10" y1="11" y2="17"/>
                        <line x1="14" x2="14" y1="11" y2="17"/>
                      </svg>
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-list">Žádné úkoly k dokončení.</div>
            )}
          </div>
        </div>

        <div className="list-section">
          <h3>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
              <polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
            Dokončené
          </h3>
          <div className="task-list">
            {completedTasks.length > 0 ? (
              completedTasks.map(task => (
                <div key={task.id} className="task-item completed">
                  <div className="task-content">
                    <span className="task-text">{task.text}</span>
                    {task.duration && (
                      <span className="task-duration">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="10"/>
                          <polyline points="12 6 12 12 16 14"/>
                        </svg>
                        {task.duration} min
                      </span>
                    )}
                  </div>
                  <div className="task-actions">
                    <button onClick={() => uncompleteTask(task.id)} className="action-button undo">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 12a9 9 0 0 0-9-9H7.83a2 2 0 0 0-1.41.59L3 7m18 5v5a2 2 0 0 1-2 2H3"/>
                        <path d="m7 15 4 4 6-6"/>
                        <path d="M3 7V5a2 2 0 0 1 2-2h2"/>
                      </svg>
                    </button>
                    <button onClick={() => deleteTask(task.id, true)} className="action-button delete">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 6h18"/>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                        <line x1="10" x2="10" y1="11" y2="17"/>
                        <line x1="14" x2="14" y1="11" y2="17"/>
                      </svg>
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-list">Žádné dokončené úkoly.</div>
            )}
          </div>
        </div>

        <div className="list-section">
          <h3>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <path d="M8 14s1.5 2 4 2 4-2 4-2"/>
              <line x1="9" x2="9.01" y1="9" y2="9"/>
              <line x1="15" x2="15.01" y1="9" y2="9"/>
            </svg>
            Volný čas
          </h3>
          <div className="task-list">
            {freeTimeActivities.length > 0 ? (
              freeTimeActivities.map(activity => (
                <div key={activity.id} className="task-item free-time">
                  <div className="task-content">
                    <span className="task-text">{activity.text}</span>
                  </div>
                  <div className="task-actions">
                    <button onClick={() => deleteFreeTimeActivity(activity.id)} className="action-button delete">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 6h18"/>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                        <line x1="10" x2="10" y1="11" y2="17"/>
                        <line x1="14" x2="14" y1="11" y2="17"/>
                      </svg>
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-list">Žádné volnočasové aktivity.</div>
            )}
          </div>
        </div>
      </div>

      {/* Schedule View */}
      <div className="schedule-section">
        <div className="schedule-header">
          <h2>Časový rozvrh</h2>
          <button
            className={`generate-schedule-button ${isGeneratingSchedule ? 'loading' : ''}`}
            onClick={handleGenerateSchedule}
            disabled={isGeneratingSchedule || tasks.length === 0}
          >
            {isGeneratingSchedule ? 'Generuji...' : 'Vygenerovat rozvrh pomocí AI'}
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 11A8 8 0 0 0 4.9 9M4 5v4h4M4 13a8 8 0 0 0 15.1 2M20 19v-4h-4"/>
            </svg>
          </button>
        </div>
        <ScheduleView schedule={schedule} />
      </div>

      {/* API Key Modal */}
      <ApiKeyModal
        isOpen={isApiKeyModalOpen}
        onClose={() => setIsApiKeyModalOpen(false)}
      />

      {/* Complex Task Modal */}
      <ComplexTaskModal
        isOpen={isComplexTaskModalOpen}
        onClose={() => setIsComplexTaskModalOpen(false)}
        onTasksCreated={handleAddSubtasks}
        onLocationTasksCreated={handleLocationTasks}
      />
    </div>
  );
}

export default TimeManager;
