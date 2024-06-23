import React, { useState, useEffect,memo } from 'react';
import axios from 'axios';
import './WeatherDisplay.css';

interface WeatherData {
    temperature: number;
    condition: string;
    humidity: number;
    windSpeed: number;
    chanceOfRain: number;
    icon: string;
  }

const WeatherDisplay = () => {
    const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
    const [isDayTime, setIsDayTime] = useState(true);

    useEffect(() => {
        const fetchWeatherData = async () => {
          try {
            const apiKey = '47d507ca44d787616e8ddca425cf51a9';
            const city = 'India';
            const response = await axios.get(
              `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
            );
    
            const data = response.data;
            const currentHour = new Date().getHours();
            setIsDayTime(currentHour > 6 && currentHour < 18);
    
            setWeatherData({
              temperature: data.main.temp,
              condition: data.weather[0].description,
              humidity: data.main.humidity,
              windSpeed: data.wind.speed,
              chanceOfRain: data.rain ? data.rain['1h'] || 0 : 0,
              icon: data.weather[0].icon,
            });
          } catch (error) {
            console.error('Error fetching weather data:', error);
          }
        };
    
        fetchWeatherData();
      }, []);

      if (!weatherData) {
        return <div>Loading weather data...</div>;
      }

  return (
    <>
      <h1>This is weather display component</h1>
      <div className="weather-display">
      <h2>Current Weather</h2>
      <img
        src={`http://openweathermap.org/img/wn/${weatherData.icon}@2x.png`}
        alt="Weather icon"
        className={isDayTime ? 'day-icon' : 'night-icon'}
      />
      <p>Temperature: {weatherData.temperature}°C</p>
      <p>Condition: {weatherData.condition}</p>
      <p>Humidity: {weatherData.humidity}%</p>
      <p>Wind Speed: {weatherData.windSpeed} m/s</p>
      <p>Chance of Rain: {weatherData.chanceOfRain}%</p>
    </div>
    </>
  );
};
export default memo(WeatherDisplay);
