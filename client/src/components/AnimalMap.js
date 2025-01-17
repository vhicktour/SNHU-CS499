import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icons in React-Leaflet
const defaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = defaultIcon;

const AnimalMap = ({ selectedAnimal }) => {
  // Center on Austin, TX
  const defaultCenter = [30.75, -97.48];
  const defaultZoom = 10;

  return (
    <div className="h-[500px] w-full rounded-lg overflow-hidden shadow">
      <MapContainer
        center={defaultCenter}
        zoom={defaultZoom}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {selectedAnimal && selectedAnimal.location_lat && selectedAnimal.location_long && (
          <Marker 
            position={[selectedAnimal.location_lat, selectedAnimal.location_long]}
            icon={defaultIcon}
          >
            <Popup>
              <div className="p-2">
                <h3 className="font-bold text-lg mb-2">{selectedAnimal.name || 'Unknown'}</h3>
                <p><span className="font-semibold">Breed:</span> {selectedAnimal.breed}</p>
                <p><span className="font-semibold">Type:</span> {selectedAnimal.animal_type}</p>
              </div>
            </Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
};

export default AnimalMap;