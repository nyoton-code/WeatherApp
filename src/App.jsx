import Search from "./compenents/search/Search";
import CurrentWeither from "./compenents/current-weither/CurrentWeither";
import { WeatherAPIUrl, weatherAPIKey } from "./Api";
import { useState } from "react";
import ForecastWeather from "./compenents/forecastWeather/ForecastWeather";
function App() {
  const [CurrentWeithers, setCurrentWeithers] = useState(null);
  const [forecast, setForecast] = useState(null);

  const fetchWeather = (lat, lon, cityLabel) => {
    const currentWeitherAPI = fetch(
      `${WeatherAPIUrl}/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${weatherAPIKey}&units=metric`
    );
    const forestWeitherAPI = fetch(
      `${WeatherAPIUrl}/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${weatherAPIKey}&units=metric`
    );

    Promise.all([currentWeitherAPI, forestWeitherAPI])
      .then(async (Response) => {
        const weatherResponse = await Response[0].json();
        const forestResponse = await Response[1].json();
        setCurrentWeithers({ city: cityLabel.label, ...weatherResponse });
        setForecast({ city: cityLabel.label, ...forestResponse });
      })
      .catch((err) => console.log(err));
  };

  const handleOnSearchChange = (searchData) => {
    if (searchData) {
      const [lat, lon] = searchData.value.split(" ");
      fetchWeather(lat, lon, searchData);
    }
  };
  window.onload = () => {
    fetchWeather("25.269722222", "55.309444444", {
      value: "25.269722222 55.309444444",
      label: "Dubai, AE",
    });
  };

  return (
    <>
      <div className="">
        <div className="container relative">
          <Search onSearchChange={handleOnSearchChange} />
          {CurrentWeithers && <CurrentWeither data={CurrentWeithers} />}
          <ForecastWeather data={forecast} />
        </div>
      </div>
    </>
  );
}

export default App;
