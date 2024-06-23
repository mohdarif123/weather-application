import React, { useState, memo ,useEffect} from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import axios from "axios";
import "./MapDisplay.css";
// Import images for Leaflet marker icons
import iconRetinaUrl from "leaflet/dist/images/marker-icon-2x.png";
import iconUrl from "leaflet/dist/images/marker-icon.png";
import shadowUrl from "leaflet/dist/images/marker-shadow.png";

// Fix the default icon issue with Leaflet in React
const DefaultIcon = L.icon({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

interface MapDisplayProps {
  latitude: number;
  longitude: number;
  zoom: number;
}

const MapDisplay: React.FC<MapDisplayProps> = ({
  latitude,
  longitude,
  zoom,
}) => {
  const [position, setPosition] = useState<[number, number]>([
    latitude,
    longitude,
  ]);
  const [weatherData, setWeatherData] = useState<any>(null);
  useEffect(() => {
    setPosition([latitude, longitude]);
    fetchWeatherData(latitude, longitude);
  }, [latitude, longitude]);

  const fetchWeatherData = async (lat: number, lon: number) => {
    try {
      const apiKey = "47d507ca44d787616e8ddca425cf51a9";
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
      );
      setWeatherData(response.data);
    } catch (error) {
      console.error("Error fetching weather data:", error);
    }
  };

  const MapEvents = () => {
    useMapEvents({
      click(e: any) {
        if (e.originalEvent.shiftKey) {
          const { lat, lng } = e.latlng;
          setPosition([lat, lng]);
          fetchWeatherData(lat, lng);
        }
      },
    });
    return null;
  };
  return (
    <>
      <div
        className="map-display"
        // style={{
        //   display: "flex",
        //   justifyContent: "space-between",
        //   flexWrap: "wrap",
        //   margin: "0 40px",
        // }}
      >
        <MapContainer
          center={position}
          zoom={zoom}
          style={{ height: "400px", width: "60%" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          />
          <Marker position={position} />
          <MapEvents />
        </MapContainer>
        {weatherData && (
          <div className="weather-info">
            <h2>Weather Info</h2>
            <p>Temperature: {weatherData.main.temp}°C</p>
            <p>Condition: {weatherData.weather[0].description}</p>
            <p>Humidity: {weatherData.main.humidity}%</p>
            <p>Wind Speed: {weatherData.wind.speed} m/s</p>
          </div>
        )}
      </div>
    </>
  );
};
export default memo(MapDisplay);
