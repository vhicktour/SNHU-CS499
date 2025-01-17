import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icons in React-Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const AnimalMap = ({ center, zoom, selectedAnimal }) => {
  return (
    <div className="h-96 w-full rounded-lg overflow-hidden">
      <MapContainer 
        center={center} 
        zoom={zoom} 
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; OpenStreetMap contributors'
        />
        
        {selectedAnimal && selectedAnimal.location_lat && selectedAnimal.location_long && (
          <Marker 
            position={[selectedAnimal.location_lat, selectedAnimal.location_long]}
          >
            <Popup>
              <div>
                <h3 className="font-semibold">{selectedAnimal.name || 'Unknown'}</h3>
                <p>{selectedAnimal.breed}</p>
                <p>{selectedAnimal.age_upon_outcome}</p>
              </div>
            </Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
};

export default AnimalMap;