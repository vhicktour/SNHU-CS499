import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

// Component to handle map centering
const MapUpdater = ({ location }) => {
  const map = useMap();
  
  useEffect(() => {
    if (location && location.lat && location.long) {
      map.setView([location.lat, location.long], 13);
    }
  }, [map, location]);
  
  return null;
};

const Map = ({ location, animal }) => {
  if (!location || !location.lat || !location.long) {
    return <div className="text-center p-4">No location data available</div>;
  }

  return (
    <MapContainer
      center={[location.lat, location.long]}
      zoom={13}
      style={{ height: '400px', width: '100%' }}
    >
      <MapUpdater location={location} />
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <Marker position={[location.lat, location.long]}>
        <Popup>
          <div>
            <h3 className="font-bold">{animal.name || 'Unnamed Animal'}</h3>
            <p>{animal.animal_type} - {animal.breed}</p>
            <p>{animal.color}</p>
          </div>
        </Popup>
      </Marker>
    </MapContainer>
  );
};

export default Map;
