const ForecastWeather = ({ data }) => {
  if (!data || !data.list) return null;

  function formatDate(d) {
    return d.toLocaleDateString("en-US", {
      weekday: "long",
      day: "numeric",
      month: "short",
    });
  }

  return (
    <>
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
            height: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
            background: #f1f5f9;
            border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
            background: #94a3b8;
            border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: #64748b;
        }
      `}</style>

      <div className=" flex items-center justify-between  p-4 font-sans">
        <div className="w-full  mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Hourly Forecast */}
          <div className="lg:col-span-2 bg-white/70 dark:bg-slate-800/50 backdrop-blur-sm p-6 rounded-2xl shadow-lg">
            <h2 className="text-xl font-semibold text-slate-800 dark:text-white mb-4">
              Hourly Forecast:
            </h2>
            <div className="flex space-x-4 overflow-x-auto pb-4 custom-scrollbar">
              {data.list.slice(0, 6).map((item, index) => (
                <div
                  key={index}
                  className={`flex flex-col items-center justify-between flex-shrink-0 w-28 h-40 p-4 bg-gradient-to-b ${
                    new Date(item.dt_txt).getHours() <= 18 &&
                    new Date(item.dt_txt).getHours() > 6
                      ? "from-[#F9A03F] to-[#FBCB75]"
                      : "from-[#3b385c] to-[#6E6AA1]"
                  } rounded-xl text-white shadow-md`}
                >
                  <p className="font-bold text-base">
                    {new Date(item.dt_txt).getHours()}:00
                  </p>
                  <img
                    src={`/icons/${item.weather[0].icon}.png`}
                    alt={item.weather[0].description}
                    className="h-12 w-12"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src =
                        "https://placehold.co/48x48/f87171/fff?text=Err";
                    }}
                  />
                  <p className="font-bold text-lg">
                    {Math.round(item.main.temp)}°C
                  </p>
                  <div className="flex items-center space-x-1">
                    <span className="text-sm">{item.wind.speed} m/s</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 5-Day Forecast */}
          <div className="lg:col-span-1 bg-white/70 dark:bg-slate-800/50 backdrop-blur-sm p-6 rounded-2xl shadow-lg">
            <h2 className="text-xl font-semibold text-slate-800 dark:text-white mb-4">
              5 Days Forecast:
            </h2>
            <div className="space-y-4">
              {data.list
                .filter(
                  (_, index) => (index % 8 === 0 && index != 0) || index == 39
                )
                .slice(0, 5)
                .map((item, i) => (
                  <div className="flex items-center justify-between" key={i}>
                    <img
                      src={`/icons/${item.weather[0].icon}.png`}
                      alt={item.weather[0].description}
                      className="w-10 h-10 rounded-full"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src =
                          "https://placehold.co/40x40/f87171/fff?text=Err";
                      }}
                    />
                    <p className="font-medium text-slate-700 dark:text-slate-200">
                      {Math.round(item.main.temp)}°C
                    </p>
                    <p className="text-slate-500 dark:text-slate-400 text-sm w-32 sm:text-base text-center ">
                      {formatDate(new Date(item.dt_txt))}
                    </p>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ForecastWeather;
