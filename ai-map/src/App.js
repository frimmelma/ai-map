import React, { useState, useEffect, useCallback } from 'react';
import './App.css';
import MapComponent from './components/MapComponent';
import SearchBar from './components/SearchBar';
import RouteInfo from './components/RouteInfo';
import TimeManager from './components/TimeManager';
import { processNaturalLanguage, getNearbyPlaces } from './services/locationService';

function App() {
  const [directions, setDirections] = useState(null);
  const [destination, setDestination] = useState(null);
  const [nearbyPlaces, setNearbyPlaces] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    // Get user's location when the app loads
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error('Error getting user location:', error);
        }
      );
    }
  }, []);

  const handleSearch = useCallback(async (query) => {
    setIsLoading(true);
    setError(null);
    setDirections(null);
    setDestination(null);
    setNearbyPlaces([]);

    try {
      // Process natural language query
      const searchTerm = await processNaturalLanguage(query);

      // In a real app, you would use the Google Places API to search for places
      // This is a mock implementation
      setTimeout(() => {
        // Mock destination data
        const mockDestination = {
          name: `Nejbližší ${searchTerm}`,
          location: {
            lat: userLocation ? userLocation.lat + 0.01 : 50.0855,
            lng: userLocation ? userLocation.lng + 0.01 : 14.4478
          },
          address: 'Ukázková adresa 123, Praha',
          rating: 4.5
        };

        setDestination(mockDestination);

        // Create mock directions data
        const mockDirections = {
          routes: [{
            legs: [{
              distance: { text: '1.2 km', value: 1200 },
              duration: { text: '15 min', value: 900 },
              steps: [
                {
                  instructions: 'Jděte rovně po ulici Hlavní',
                  distance: { text: '400 m', value: 400 },
                  duration: { text: '5 min', value: 300 }
                },
                {
                  instructions: 'Odbočte doprava na ulici Dlouhá',
                  distance: { text: '350 m', value: 350 },
                  duration: { text: '4 min', value: 240 }
                },
                {
                  instructions: 'Odbočte doleva na ulici Krátká',
                  distance: { text: '450 m', value: 450 },
                  duration: { text: '6 min', value: 360 }
                }
              ]
            }]
          }]
        };

        setDirections(mockDirections);

        // Get nearby places
        getNearbyPlaces(mockDestination.location, searchTerm)
          .then(places => {
            setNearbyPlaces(places);
            setIsLoading(false);
          });
      }, 1500); // Simulate API delay

    } catch (err) {
      console.error('Search error:', err);
      setError('Nastala chyba při vyhledávání.');
      setIsLoading(false);
    }
  }, [userLocation]);

  const [showMap, setShowMap] = useState(false);
  const [locationTasks, setLocationTasks] = useState([]);

  // Handle location tasks from TimeManager
  const handleLocationTasks = (tasks) => {
    setLocationTasks(tasks);
    // Automatically switch to map view when location tasks are added
    setShowMap(true);

    // If there are location tasks, search for the first one
    if (tasks && tasks.length > 0) {
      handleSearch(tasks[0].location);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>AI Mapa</h1>
        <p className="App-subtitle">Automatická navigace kamkoliv</p>
        <div className="view-toggle">
          <button
            className={!showMap ? 'active' : ''}
            onClick={() => setShowMap(false)}
          >
            Časový manažer
          </button>
          <button
            className={showMap ? 'active' : ''}
            onClick={() => setShowMap(true)}
          >
            Mapa
            {locationTasks.length > 0 && (
              <span className="location-badge">{locationTasks.length}</span>
            )}
          </button>
        </div>
      </header>

      <main className="App-main">
        {showMap ? (
          <>
            <div className="search-section">
              <SearchBar onSearch={handleSearch} isLoading={isLoading} />
              {error && <div className="error-message">{error}</div>}

              {locationTasks.length > 0 && (
                <div className="location-tasks-list">
                  <h3>Místa k navštívení:</h3>
                  <ul>
                    {locationTasks.map((task, index) => (
                      <li key={task.id} className={index === 0 && directions ? 'active' : ''}>
                        <button onClick={() => handleSearch(task.location)}>
                          {task.text} - {task.location}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="content-container">
              <div className="map-container">
                <MapComponent
                  directions={directions}
                  destination={destination}
                />
              </div>

              <div className="info-container">
                {isLoading ? (
                  <div className="loading-message">Hledám nejlepší cestu...</div>
                ) : directions ? (
                  <RouteInfo
                    directions={directions}
                    destination={destination}
                    nearbyPlaces={nearbyPlaces}
                  />
                ) : (
                  <div className="instructions">
                    <h2>Vítejte v AI Mapě</h2>
                    <p>Napište do vyhledávacího pole, co hledáte, například:</p>
                    <ul>
                      <li>"Chci najít zmrzlinu"</li>
                      <li>"Kde je nejbližší hospoda"</li>
                      <li>"Potřebuji najít Vajnos"</li>
                    </ul>
                    <p>AI vám automaticky najde nejbližší místo a ukáže cestu.</p>
                  </div>
                )}
              </div>
            </div>
          </>
        ) : (
          <TimeManager onLocationTasks={handleLocationTasks} />
        )}
      </main>

      <footer className="App-footer">
        <p>AI Mapa - Automatická navigace pro všechny</p>
      </footer>
    </div>
  );
}

export default App;
