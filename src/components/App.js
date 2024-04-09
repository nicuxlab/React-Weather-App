import React, { useState, useEffect } from "react";
import axios from "axios";
import SearchEngine from "./SearchEngine";
import Forecast from "./Forecast";

import "../styles.css";
import '@fortawesome/fontawesome-free/css/all.min.css';


function App() {
  const [query, setQuery] = useState();
  
  const [weather, setWeather] = useState({
    loading: true,
    data: {},
    error: false
  });

  const toDate = () => {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December"
    ];
    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday"
    ];

    const currentDate = new Date();
    const date = `${days[currentDate.getDay()]} ${currentDate.getDate()} ${
      months[currentDate.getMonth()]
    }`;
    return date;
  };
//search : Une fonction qui est appelée lorsque l'utilisateur appuie sur la touche "Entrée" dans le champ de recherche. Elle 
//effectue une requête API pour obtenir les données météo de la ville spécifiée par l'utilisateur.
  
const search = async (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      setQuery("");
      setWeather({ ...weather, loading: true });
      const apiKey = "b03a640e5ef6980o4da35b006t5f2942";
      const url = `https://api.shecodes.io/weather/v1/current?query=${query}&key=${apiKey}`;

      await axios
        .get(url)
        .then((res) => {
          console.log("res", res);
          setWeather({ data: res.data, loading: false, error: false });
        })
        .catch((error) => {
          setWeather({ ...weather, data: {}, error: true });
          setQuery("");
          console.log("error", error);
        });
    }
  };

  //Utilisation de useEffect pour effectuer une requête API 
  //initiale pour obtenir les données météo de la ville au chargement de l'application.
  useEffect(() => {
    const fetchData = async () => {
      const apiKey = "b03a640e5ef6980o4da35b006t5f2942";
      const url = `https://api.shecodes.io/weather/v1/current?query=Cotonou&key=${apiKey}`;

      try {
        const response = await axios.get(url);

        setWeather({ data: response.data, loading: false, error: false });
      } catch (error) {
        setWeather({ data: {}, loading: false, error: true });
        console.log("error", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="App">

      {/* Affichage du composant SearchEngine pour permettre à l'utilisateur de saisir une ville à rechercher. */}
      
      <SearchEngine query={query} setQuery={setQuery} search={search} />

      
      {/*Affichage d'un message de chargement */}
     
      {weather.loading && (
        <>
          <br />
          <br />
          <h4>Patientez la recherche..</h4>
        </>
      )}

      {/*Affichage d'un message d'erreur si la ville recherchée n'est pas trouvée */}

      {weather.error && (
        <>
          <br />
          <br />
          <span className="error-message">
            <span style={{ fontFamily: "font" }}>
                Désolé, ville introuvable, veuillez réessayer.
            </span>
          </span>
        </>
      )}

    {/* Affichage du composant Forecast pour afficher les données météo actuelles une fois qu'elles sont disponibles.*/}     
 
      {weather && weather.data && weather.data.condition && (
          <Forecast weather={weather} toDate={toDate} />
        )}

      </div>
    );
}

export default App;
