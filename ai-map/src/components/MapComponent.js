import React, { useState, useEffect, useRef } from 'react';

const containerStyle = {
  width: '100%',
  height: '100%',
  position: 'relative'
};

// We'll use this when we implement real maps
// const defaultCenter = {
//   lat: 50.0755, // Default center (Prague, Czech Republic)
//   lng: 14.4378
// };

function MapComponent({ destination }) {
  const [userLocation, setUserLocation] = useState(null);
  const mapContainerRef = useRef(null);

  // Get user location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userPos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setUserLocation(userPos);
        },
        () => {
          console.log('Error getting location');
        }
      );
    }
  }, []);

  // Render a simple map representation
  return (
    <div style={containerStyle} ref={mapContainerRef}>
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: '#e5e3df',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '20px'
      }}>
        <div style={{ marginBottom: '20px' }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="#4285F4" stroke="white" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
            <circle cx="12" cy="10" r="3"/>
          </svg>
        </div>

        <h3 style={{ marginBottom: '10px', color: '#333' }}>Mapa je připravena</h3>

        {userLocation ? (
          <p>Vaše poloha: {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}</p>
        ) : (
          <p>Získávám vaši polohu...</p>
        )}

        {destination && (
          <div style={{ marginTop: '20px', padding: '10px', backgroundColor: 'white', borderRadius: '8px', maxWidth: '300px' }}>
            <p style={{ fontWeight: 'bold', marginBottom: '5px' }}>{destination.name}</p>
            <p style={{ fontSize: '14px', color: '#666' }}>{destination.address}</p>
          </div>
        )}

        <p style={{ marginTop: '20px', fontSize: '14px', color: '#666' }}>
          Pro zobrazení skutečné mapy je potřeba nastavit Google Maps API klíč.
        </p>
      </div>
    </div>
  );
}

export default React.memo(MapComponent);
