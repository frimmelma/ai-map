import React from 'react';
import '../styles/ScheduleView.css';

function ScheduleView({ schedule }) {
  // Calculate total scheduled time
  const calculateTotalTime = () => {
    if (!schedule || schedule.length === 0) return 0;

    let totalMinutes = 0;
    schedule.forEach(block => {
      const [startHours, startMinutes] = block.start_time.split(':').map(Number);
      const [endHours, endMinutes] = block.end_time.split(':').map(Number);

      const startTotalMinutes = startHours * 60 + startMinutes;
      const endTotalMinutes = endHours * 60 + endMinutes;

      totalMinutes += (endTotalMinutes - startTotalMinutes);
    });

    return totalMinutes;
  };

  const totalMinutes = calculateTotalTime();
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  // Helper function to calculate position and height based on time
  const calculateTimePosition = (timeString) => {
    const [hours, minutes] = timeString.split(':').map(Number);
    const totalMinutes = hours * 60 + minutes;

    // Assuming day starts at 8:00 (480 minutes) and ends at 22:00 (1320 minutes)
    const dayStartMinutes = 8 * 60;
    const dayTotalMinutes = 14 * 60; // 14 hours from 8:00 to 22:00

    // Calculate percentage position
    return ((totalMinutes - dayStartMinutes) / dayTotalMinutes) * 100;
  };

  // Helper function to calculate block height based on duration
  const calculateBlockHeight = (startTime, endTime) => {
    const [startHours, startMinutes] = startTime.split(':').map(Number);
    const [endHours, endMinutes] = endTime.split(':').map(Number);

    const startTotalMinutes = startHours * 60 + startMinutes;
    const endTotalMinutes = endHours * 60 + endMinutes;

    const durationMinutes = endTotalMinutes - startTotalMinutes;
    const dayTotalMinutes = 14 * 60; // 14 hours from 8:00 to 22:00

    return (durationMinutes / dayTotalMinutes) * 100;
  };

  // Generate time markers for the schedule (hourly)
  const timeMarkers = [];
  for (let hour = 8; hour <= 22; hour++) {
    const position = calculateTimePosition(`${hour}:00`);
    timeMarkers.push(
      <div
        key={hour}
        className="time-marker"
        style={{ top: `${position}%` }}
      >
        {hour}:00
      </div>
    );
  }

  return (
    <div className="schedule-view">
      <div className="schedule-header">
        <h3>Denní rozvrh</h3>
        {schedule.length > 0 && (
          <div className="schedule-stats">
            <span className="schedule-time">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
              </svg>
              Naplánováno: {hours}h {minutes}min
            </span>
            <span className="schedule-count">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="8" y1="6" x2="21" y2="6"></line>
                <line x1="8" y1="12" x2="21" y2="12"></line>
                <line x1="8" y1="18" x2="21" y2="18"></line>
                <line x1="3" y1="6" x2="3.01" y2="6"></line>
                <line x1="3" y1="12" x2="3.01" y2="12"></line>
                <line x1="3" y1="18" x2="3.01" y2="18"></line>
              </svg>
              Počet aktivit: {schedule.length}
            </span>
          </div>
        )}
      </div>

      <div className="schedule-container">
        <div className="time-markers">
          {timeMarkers}
        </div>

        <div className="schedule-blocks">
          {schedule.length > 0 ? (
            schedule.map((block, index) => {
              const topPosition = calculateTimePosition(block.start_time);
              const height = calculateBlockHeight(block.start_time, block.end_time);

              return (
                <div
                  key={index}
                  className={`schedule-block ${block.type}`}
                  style={{
                    top: `${topPosition}%`,
                    height: `${height}%`
                  }}
                >
                  <div className="block-time">
                    {block.start_time} - {block.end_time}
                  </div>
                  <div className="block-activity">
                    {block.activity}
                  </div>
                  {block.type === 'task' && (
                    <div className="block-duration">
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"/>
                        <polyline points="12 6 12 12 16 14"/>
                      </svg>
                      {Math.round((calculateBlockHeight(block.start_time, block.end_time) / 100) * 14 * 60)} min
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="empty-schedule">
              Žádné naplánované aktivity. Přidejte úkoly a volnočasové aktivity pro vytvoření rozvrhu.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ScheduleView;
