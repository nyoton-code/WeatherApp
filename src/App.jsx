import Search from "./compenents/search/Search";
import CurrentWeither from "./compenents/current-weither/CurrentWeither";
import { WeatherAPIUrl, weatherAPIKey } from "./Api";
import { useCallback, useEffect, useState } from "react";
import ForecastWeather from "./compenents/forecastWeather/ForecastWeather";

const defaultLocation = {
  lat: "25.269722222",
  lon: "55.309444444",
  label: "Dubai, AE",
};

const isObject = (value) => value !== null && typeof value === "object";

const isCurrentWeatherResponse = (data) =>
  isObject(data) &&
  isObject(data.main) &&
  typeof data.main.temp === "number" &&
  typeof data.main.feels_like === "number" &&
  typeof data.main.humidity === "number" &&
  typeof data.main.pressure === "number" &&
  isObject(data.wind) &&
  typeof data.wind.speed === "number" &&
  isObject(data.sys) &&
  typeof data.sys.sunrise === "number" &&
  typeof data.sys.sunset === "number" &&
  typeof data.timezone === "number" &&
  Array.isArray(data.weather) &&
  isObject(data.weather[0]) &&
  typeof data.weather[0].icon === "string" &&
  typeof data.weather[0].description === "string";

const isForecastResponse = (data) =>
  isObject(data) &&
  Array.isArray(data.list) &&
  data.list.length > 0 &&
  data.list.every(
    (item) =>
      isObject(item) &&
      typeof item.dt_txt === "string" &&
      isObject(item.main) &&
      typeof item.main.temp === "number" &&
      isObject(item.wind) &&
      typeof item.wind.speed === "number" &&
      Array.isArray(item.weather) &&
      isObject(item.weather[0]) &&
      typeof item.weather[0].icon === "string" &&
      typeof item.weather[0].description === "string"
  );

const getHttpError = (response) => {
  if (response.status === 401) {
    return "OpenWeatherMap rejected the API key (401). Check that VITE_APP_OPENWEATHER_API_KEY is correct and active.";
  }
  if (response.status === 429) {
    return "OpenWeatherMap rate limit reached (429). Please wait a moment and retry.";
  }
  return `Weather request failed (${response.status} ${response.statusText}). Please retry.`;
};

function App() {
  const [CurrentWeithers, setCurrentWeithers] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastRequest, setLastRequest] = useState(defaultLocation);

  const fetchWeather = useCallback(async (lat, lon, cityLabel) => {
    setIsLoading(true);
    setError(null);

    if (!weatherAPIKey?.trim()) {
      setError(
        "Weather API key is missing. Set VITE_APP_OPENWEATHER_API_KEY in your environment and rebuild the app."
      );
      setIsLoading(false);
      return;
    }

    try {
      const query = new URLSearchParams({
        lat,
        lon,
        appid: weatherAPIKey,
        units: "metric",
      });
      const [currentResponse, forecastResponse] = await Promise.all([
        fetch(`${WeatherAPIUrl}/data/2.5/weather?${query}`),
        fetch(`${WeatherAPIUrl}/data/2.5/forecast?${query}`),
      ]);

      if (!currentResponse.ok) throw new Error(getHttpError(currentResponse));
      if (!forecastResponse.ok) throw new Error(getHttpError(forecastResponse));

      let currentData;
      let forecastData;
      try {
        [currentData, forecastData] = await Promise.all([
          currentResponse.json(),
          forecastResponse.json(),
        ]);
      } catch {
        throw new Error("Weather service returned invalid JSON. Please retry.");
      }

      if (!isCurrentWeatherResponse(currentData)) {
        throw new Error("Weather service returned an unexpected current-weather response.");
      }
      if (!isForecastResponse(forecastData)) {
        throw new Error("Weather service returned an unexpected forecast response.");
      }

      setCurrentWeithers({ city: cityLabel, ...currentData });
      setForecast({ city: cityLabel, ...forecastData });
    } catch (requestError) {
      console.error("Unable to fetch weather data:", requestError);
      setError(
        requestError instanceof TypeError
          ? "Could not connect to the weather service. Check your connection and retry."
          : requestError instanceof Error
            ? requestError.message
            : "An unexpected error occurred while loading weather data."
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWeather(defaultLocation.lat, defaultLocation.lon, defaultLocation.label);
  }, [fetchWeather]);

  const handleOnSearchChange = (searchData) => {
    if (searchData) {
      const [lat, lon] = searchData.value.split(" ");
      const request = { lat, lon, label: searchData.label };
      setLastRequest(request);
      fetchWeather(request.lat, request.lon, request.label);
    }
  };

  return (
    <>
      <div className="">
        <div className="container relative">
          <Search onSearchChange={handleOnSearchChange} />
          {isLoading && (
            <p className="p-4 text-center" role="status">
              Loading weather…
            </p>
          )}
          {error && (
            <div
              className="m-4 rounded-xl bg-red-100 p-4 text-center text-red-800"
              role="alert"
            >
              <p>{error}</p>
              <button
                type="button"
                className="mt-3 rounded-lg bg-red-800 px-4 py-2 font-medium text-white disabled:opacity-60"
                onClick={() =>
                  fetchWeather(lastRequest.lat, lastRequest.lon, lastRequest.label)
                }
                disabled={isLoading}
              >
                Retry
              </button>
            </div>
          )}
          {CurrentWeithers && <CurrentWeither data={CurrentWeithers} />}
          <ForecastWeather data={forecast} />
        </div>
      </div>
    </>
  );
}

export default App;
