import React, { useEffect, useState } from "react";
import axios from "axios";
import ReactAnimatedWeather from "react-animated-weather";

function Forecast({ weather }) {
  const { data } = weather;
  const [forecastData, setForecastData] = useState([]);
  const [isCelsius, setIsCelsius] = useState(true); // Track temperature unit

  useEffect(() => {
    const fetchForecastData = async () => {
    
      // Construction de l'URL pour l'API météo en fonction de la ville actuelle
      const apiKey = "b03a640e5ef6980o4da35b006t5f2942";
      const url = `https://api.shecodes.io/weather/v1/forecast?query=${data.city}&key=${apiKey}&units=metric`;

      try {

        // Récupération des données de prévision météorologique
        const response = await axios.get(url);
        setForecastData(response.data.daily);

      } catch (error) {
        console.log("Erreur lors de la récupération des données de prévision:", error);
      }
    };

    fetchForecastData();
  }, [data.city]);

  const formatDay = (dateString) => {
    const options = { weekday: "short" };
    const date = new Date(dateString * 1000);
    return date.toLocaleDateString("fr-FR", options);
  };

  const getCurrentDate = () => {
    const options = {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric"
    };
    const currentDate = new Date().toLocaleDateString("fr-FR", options);
    return currentDate;
  };

  const toggleTemperatureUnit = () => {
    setIsCelsius((prevState) => !prevState);
  };

  const convertToCelsius = (temperature) => {
    return Math.round((temperature - 32) * (5 / 9));
  };

  const convertToFahrenheit = (temperature) => {
    return Math.round((temperature * 9) / 5 + 32);
  };

  const renderTemperature = (temperature) => {
    if (isCelsius) {
      return Math.round(temperature);
    } else {
      return convertToFahrenheit(temperature);
    }
  };

  return (
    <div>
      <div className="city-name">
        <h2>
          {data.city}, <span>{data.country}</span>
        </h2>
      </div>

      <div className="date">
        <span>{getCurrentDate()}</span>
      </div>

      {/* Affichage de la température */}

      <div className="temp">
        {/* Affichage de l'icône météo */}
        {data.condition.icon_url && (
          <img
            src={data.condition.icon_url}
            alt={data.condition.description}
            className="temp-icon"
          />
        )}

        {/* Affichage de la température actuelle */}


        {renderTemperature(data.temperature.current)}

        {/* Affichage de l'unité de température et du lien pour basculer */}

        <sup className="temp-deg" onClick={toggleTemperatureUnit}>
          {isCelsius ? "°C" : "°F"} | {isCelsius ? "°F" : "°C"}
        </sup>

      </div>
      {/* Affichage de la description de la condition météo */}
      
      <p className="weather-des">{data.condition.description}</p>

       {/* Affichage des informations météo supplémentaires */}

      <div className="weather-info">
        
        {/* Affichage de la vitesse du vent */}

        <div className="col">
          <ReactAnimatedWeather icon="WIND" size="40"/>
          <div>
            <p className="wind">{data.wind.speed}m/s</p>
            <p>Vitesse du vent</p>
          </div>
        </div>

        {/* Affichage de l'humidité */}

        <div className="col">
          <ReactAnimatedWeather icon="RAIN" size="40"/>
          <div>
            <p className="humidity">{data.temperature.humidity}%</p>
            <p>Humidité</p>
        </div>
        </div>
      </div>

    {/* Affichage des prévisions météo pour les 5 prochains jours */}
      <div className="forecast">
        <h3>Prévisions sur 5 jours:</h3>
        <div className="forecast-container">
          {forecastData &&
            forecastData.slice(0, 5).map((day) => (
              <div className="day" key={day.time}>
                <p className="day-name">{formatDay(day.time)}</p>
                {day.condition.icon_url && (
                  <img
                    className="day-icon"
                    src={day.condition.icon_url}
                    alt={day.condition.description}
                  />
                )}
                <p className="day-temperature">
                  {Math.round(day.temperature.minimum)}°/ <span>{Math.round(day.temperature.maximum)}°</span>
                </p>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}        

export default Forecast;