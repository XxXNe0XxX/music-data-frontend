import { useState, useMemo, useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";
import { FaSearch } from "react-icons/fa";

export default function CountrySearch({ countries, onSelectCountry }) {
  const [searchTerm, setSearchTerm] = useState("");
  const { isDark } = useContext(ThemeContext);
  const filteredCountries = useMemo(() => {
    if (!countries || !Array.isArray(countries)) return [];
    const lowerTerm = searchTerm.toLowerCase();

    return countries.filter((c) => {
      const name = c.properties.name.toLowerCase();
      return name.includes(lowerTerm);
    });
  }, [countries, searchTerm]);

  const handleSelect = (country) => {
    setSearchTerm(country.properties.name);
    onSelectCountry(country);
  };

  return (
    <div style={{ position: "relative" }} className="flex items-center gap-x-3">
      <FaSearch></FaSearch>
      <input
        type="text"
        value={searchTerm}
        placeholder="Buscar país"
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ width: 200, padding: 6 }}
        className={`rounded-md ${
          isDark ? "bg-black border-white" : "bg-white border-black"
        } border-opacity-65 border`}
      />

      {searchTerm && filteredCountries.length > 0 && (
        <ul
          style={{
            background: isDark ? "black" : "white",
            position: "absolute",
            border: "1px solid #ccc",
            width: 200,
            maxHeight: 200,
            overflowY: "auto",
            listStyle: "none",
            /* Changes here: place the dropdown above the input */
            bottom: "100%",
            marginBottom: "4px",
          }}
        >
          {filteredCountries.map((country) => (
            <li
              key={country.properties.iso_a3}
              style={{
                padding: "6px 10px",
                cursor: "pointer",
                borderBottom: "1px solid #eee",
              }}
              onClick={() => {
                handleSelect(country);
                setSearchTerm("");
              }}
            >
              {country.properties.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
