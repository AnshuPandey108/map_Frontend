import React, { useState } from 'react';
import { MapContainer, TileLayer, Rectangle, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './App.css'; // Import your CSS file for global styles

function App() {
  const [bounds, setBounds] = useState(null);

  const handleClick = async () => {
    if (!bounds) return;

    const response = await fetch('http://localhost:8000/api/process_coordinates/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        coordinates: {
          north: bounds[1][0],
          south: bounds[0][0],
          east: bounds[1][1],
          west: bounds[0][1],
        },
      }),
    });

    if (response.ok) {
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = 'image.png';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } else {
      console.error('Error fetching image:', response.statusText);
    }
  };

  return (
    <div className="app-container">
      <MapContainer center={[51.505, -0.09]} zoom={13} id="map">
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <DrawingComponent setBounds={setBounds} />
        {bounds && <Rectangle bounds={bounds} />}
      </MapContainer>
      <button className="fetch-button" onClick={handleClick}>Fetch Image</button>
    </div>
  );
}

function DrawingComponent({ setBounds }) {
  useMapEvents({
    click(event) {
      const bounds = [[event.latlng.lat, event.latlng.lng], [event.latlng.lat + 0.01, event.latlng.lng + 0.01]];
      setBounds(bounds);
    },
  });

  return null;
}

export default App;
