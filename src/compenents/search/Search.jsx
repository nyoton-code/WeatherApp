import { useState, useEffect } from "react";
import { AsyncPaginate } from "react-select-async-paginate";
import { url, geoApiOptions } from "../../Api";

const Search = ({ onSearchChange }) => {
  const [darkMode, setDarkMode] = useState(false);
  const [search, setSearch] = useState(null);

  // Dark mode toggle effect
  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  // Handle city selection
  const handleSearch = (selectedOption) => {
    setSearch(selectedOption);
    onSearchChange(selectedOption);
  };

  // Fetch cities for dropdown
  const loadOptions = async (inputValue) => {
    try {
      const response = await fetch(
        `${url}/cities?minPopulation=100000&namePrefix=${inputValue}`,
        geoApiOptions
      );
      const data = await response.json();
      return {
        options: data.data.map((city) => ({
          value: `${city.latitude} ${city.longitude}`,
          label: `${city.name}, ${city.countryCode}`,
        })),
        hasMore: false,
      };
    } catch (error) {
      console.error(error);
      return { options: [] };
    }
  };

  const customStyles = {
    control: (base) => ({
      ...base,
      borderRadius: "1rem",
      paddingLeft: "2.5rem",
      border: "none",
      background: darkMode
        ? "linear-gradient(90deg, #2c2c2c, #3a3a3a)"
        : "linear-gradient(90deg, rgb(240, 240, 240), white)",
      boxShadow: darkMode
        ? "0px 0px 10px rgba(255, 255, 255, 0.1)"
        : "0px 0px 15px rgba(0, 0, 0, 0.1)",
      minHeight: "48px",
      // color: "green",
    }),

    placeholder: (base) => ({
      ...base,
      color: darkMode ? "#bbb" : "#666",
      fontSize: "0.80rem",
    }),
    singleValue: (base) => ({
      ...base,
      color: darkMode ? "#fff" : "#000",
      fontWeight: 500,
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isFocused
        ? darkMode
          ? "#444"
          : "#f0f0f0"
        : "transparent",
      color: darkMode ? "black" : "#000",
      cursor: "pointer",
      padding: "10px 15px",
    }),
    menu: (base) => ({
      ...base,
      borderRadius: "0.75rem",
      marginTop: "5px",
      boxShadow: darkMode
        ? "0px 4px 15px rgba(0, 0, 0, 0.5)"
        : "0px 4px 15px rgba(0, 0, 0, 0.1)",
    }),
    input: (base) => ({
      ...base,
      color: darkMode ? "#fff" : "#000",
    }),
  };

  return (
    <div className="flex items-center justify-evenly gap-4">
      {/* Dark Mode Toggle */}
      <button
        onClick={() => setDarkMode(!darkMode)}
        className="w-20 h-8 cursor-pointer shadow-xl  flex items-center dark:border-none  border border-black bg-gray-300 dark:bg-gray-600 rounded-full p-1 transition-colors duration-300"
      >
        <div
          className={`bg-black dark:bg-yellow-400 w-6 h-6 rounded-full shadow-md transform duration-300 ${
            darkMode ? "translate-x-12" : "translate-x-0"
          }`}
        />
      </button>

      {/* Search Bar */}
      <div className="relative w-9/12">
        <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none z-40"></i>
        <AsyncPaginate
          placeholder="Search for your preferred city"
          debounceTimeout={500}
          value={search}
          onChange={handleSearch}
          loadOptions={loadOptions}
          styles={customStyles}
          className="w-full  dark:caret-gray-200 "
        />
      </div>
    </div>
  );
};

export default Search;
