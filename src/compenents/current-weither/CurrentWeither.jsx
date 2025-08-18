import MyIcon from "../../assets/sunrise.svg?react";
import Sunset from "../../assets/sunset.svg?react";

const CurrentWeither = ({ data }) => {
  function formatDateTime(timezone) {
    const now = new Date();
    const localTime = new Date(now.getTime() + (timezone - 3600) * 1000);
    return {
      time: localTime.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      date: localTime.toLocaleDateString("en-US", {
        weekday: "long",
        day: "numeric",
        month: "short",
      }),
    };
  }
  const { time, date } = formatDateTime(data.timezone);

  const weatherDetails = [
    {
      img: "/public/icons/case1.png",
      title: "Feels Like",
      value: Math.round(data.main.feels_like) + "°C",
    },
    {
      img: "/public/icons/case2.png",
      title: "Humidity",
      value: data.main.humidity + "%",
    },
    {
      img: "/public/icons/case3.png",
      title: "Pressure",
      value: data.main.pressure + " hPa",
    },
    {
      img: "/public/icons/case4.png",
      title: "Wind Speed",
      value: Math.round(data.wind.speed) + " m/s",
    },
  ];

  const formatTime = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  return (
    <div className="container mx-auto flex flex-col lg:flex-row p-4 gap-4 rounded-4xl">
      <div className="flex-1 bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-white shadow-xl rounded-3xl text-center p-6 flex flex-col items-center justify-center">
        <h2 className="mb-4 text-2xl font-bold">{data.city}</h2>
        <h2 className="text-6xl font-bold">{time}</h2>
        <p className="mt-2 text-lg font-medium">{date}</p>
      </div>

      <div className="flex-[2] grid grid-cols-1 sm:grid-cols-3 gap-4 bg-gray-200 dark:bg-gray-800 rounded-3xl p-6 text-gray-800 dark:text-white">
        {/* Temperature + Sunrise/Sunset */}
        <div className="flex flex-col items-center justify-center gap-4  p-4 rounded-xl">
          <div className="text-4xl font-bold">
            {Math.round(data.main.temp)}°C
          </div>
          <div className="text-lg">
            Feels like: {Math.round(data.main.feels_like)}°C
          </div>
          <div className="flex items-center gap-3">
            <MyIcon className="w-8 h-8" />
            <div className="flex flex-col text-sm">
              <span>Sunrise</span>
              <span>{formatTime(data.sys.sunrise)}</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Sunset className="w-8 h-8" />
            <div className="flex flex-col text-sm">
              <span>Sunset</span>
              <span>{formatTime(data.sys.sunset)}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center gap-3   p-4 rounded-xl">
          <img
            src={`/public/icons/${data.weather[0].icon}.png`}
            alt=""
            className="w-32 h-32"
          />
          <span className="capitalize text-lg font-medium">
            {data.weather[0].description}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4  p-4 rounded-xl">
          {weatherDetails.map((item, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center gap-1"
            >
              <img
                src={item.img}
                alt={item.title}
                className="h-10 w-10 object-contain"
              />
              <h3 className="text-sm font-medium">{item.title}</h3>
              <span className="text-sm">{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CurrentWeither;
