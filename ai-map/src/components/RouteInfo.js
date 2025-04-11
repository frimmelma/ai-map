import React from 'react';

function RouteInfo({ directions, destination, nearbyPlaces }) {
  if (!directions || !directions.routes || !directions.routes[0] || !directions.routes[0].legs || !directions.routes[0].legs[0]) {
    return <div className="loading-message">Informace o trase nejsou k dispozici.</div>;
  }

  const route = directions.routes[0];
  const legs = route.legs[0];

  return (
    <div className="route-info">
      <h2>Cesta k cíli: {destination?.name || 'Cíl'}</h2>

      <div className="route-summary">
        <div className="route-detail">
          <span className="detail-label">Vzdálenost:</span>
          <span className="detail-value">{legs.distance.text}</span>
        </div>
        <div className="route-detail">
          <span className="detail-label">Doba cesty:</span>
          <span className="detail-value">{legs.duration.text}</span>
        </div>
      </div>

      <div className="route-steps">
        <h3>Navigace krok za krokem:</h3>
        <ol>
          {legs.steps.map((step, index) => (
            <li key={index} className="route-step">
              <span dangerouslySetInnerHTML={{ __html: step.instructions }} />
              <div className="step-details">
                <span>{step.distance.text}</span>
                <span>{step.duration.text}</span>
              </div>
            </li>
          ))}
        </ol>
      </div>

      {nearbyPlaces && nearbyPlaces.length > 0 && (
        <div className="nearby-places">
          <h3>V okolí najdeš:</h3>
          <ul className="places-list">
            {nearbyPlaces.map((place, index) => (
              <li key={index} className="place-item">
                <span className="place-name">{place.name}</span>
                <span className="place-distance">{place.distance}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default RouteInfo;
