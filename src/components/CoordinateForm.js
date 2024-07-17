import React, { useState } from 'react';
import axios from 'axios';
import './CoordinateForm.css'; // Import your CSS for styling

const CoordinateForm = () => {
  const [coordinates, setCoordinates] = useState({
    lat_min: '',
    lon_min: '',
    lat_max: '',
    lon_max: '',
  });
  const [imageURL, setImageURL] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCoordinates({ ...coordinates, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/api/process_coordinates/', coordinates);
      setImageURL(response.data.image_url);
    } catch (error) {
      console.error('Error fetching image:', error);
    }
  };

  return (
    <div className="coordinate-form-container">
      <h2>Enter Coordinates</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Latitude Min:</label>
          <input type="text" name="lat_min" value={coordinates.lat_min} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Longitude Min:</label>
          <input type="text" name="lon_min" value={coordinates.lon_min} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Latitude Max:</label>
          <input type="text" name="lat_max" value={coordinates.lat_max} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Longitude Max:</label>
          <input type="text" name="lon_max" value={coordinates.lon_max} onChange={handleChange} />
        </div>
        <button type="submit" className="submit-button">Submit</button>
      </form>
      {imageURL && (
        <div className="image-preview">
          <h2>Downloaded Image</h2>
          <img src={`http://localhost:8000/${imageURL}`} alt="Downloaded" className="downloaded-image" />
        </div>
      )}
    </div>
  );
};

export default CoordinateForm;
