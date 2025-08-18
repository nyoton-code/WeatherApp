export const geoApiOptions = {
  method: "GET",
  headers: {
    "x-rapidapi-key": "60940467e3mshbae313015aba1f3p16ccd6jsnc2debb9f2780",
    "x-rapidapi-host": "wft-geo-db.p.rapidapi.com",
  },
};
const apiKey = import.meta.env.VITE_APP_OPENWEATHER_API_KEY;

export const url = "https://wft-geo-db.p.rapidapi.com/v1/geo";
export const WeatherAPIUrl = "https://api.openweathermap.org";
export const weatherAPIKey = apiKey;
