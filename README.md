🌤️ Weather App

A simple weather application built with React + Tailwind CSS.
It displays the current weather and a 5-day forecast (daily max temperatures) using the OpenWeather API.

🚀 Features

Current weather (temperature, description, city)

5-day forecast (daily max temp)

Responsive UI with Tailwind CSS

Clean and modern card-based design

🛠️ Tech Stack

React (frontend framework)

Tailwind CSS (styling)

OpenWeather API (weather data)

## Configuration

Create a `.env` file in the project root with your OpenWeatherMap API key:

```env
VITE_APP_OPENWEATHER_API_KEY=your_openweathermap_api_key
```

For Vercel deployments, add `VITE_APP_OPENWEATHER_API_KEY` in Project Settings → Environment Variables for each deployment environment that needs it, then redeploy. Vite embeds `VITE_` variables in the client build, so this value is visible to users of the deployed app; use a server-side proxy if the key must remain private.