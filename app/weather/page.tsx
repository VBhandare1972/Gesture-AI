"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";

export default function WeatherPage() {
  const { weatherState, setWeatherState, searchWeather, useMyLocationWeather } = useApp();
  const [cityInput, setCityInput] = useState(weatherState.cityInput || "");

  const handleSearch = () => {
    if (!cityInput.trim()) return;
    setWeatherState((prev) => ({ ...prev, cityInput }));
    searchWeather(cityInput, false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const getWeatherIcon = (desc: string) => {
    const d = (desc || "").toLowerCase();
    if (d.includes("clear")) return "☀️";
    if (d.includes("cloud") || d.includes("overcast")) return "☁️";
    if (d.includes("fog")) return "🌫️";
    if (d.includes("drizzle") || d.includes("rain") || d.includes("shower")) return "🌧️";
    if (d.includes("snow")) return "❄️";
    if (d.includes("thunderstorm")) return "⛈️";
    return "🌡️";
  };

  return (
    <section className="view active" id="view-weather">
      <div className="view-head">
        <div>
          <div className="eyebrow">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" />
            </svg>{" "}
            Module 04
          </div>
          <h1 className="view-title">Weather</h1>
          <div className="view-sub">Live conditions via Open-Meteo. No API key, no tracking.</div>
        </div>
      </div>

      <div className="weather-search">
        <input
          type="text"
          id="weatherCityInput"
          placeholder="Search a city..."
          value={cityInput}
          onChange={(e) => setCityInput(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button
          className="btn btn-ghost btn-icon"
          id="weatherLocBtn"
          title="Use my location"
          onClick={() => useMyLocationWeather(false)}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="10" r="3" />
            <path d="M12 21.7C17.3 17 20 13 20 10a8 8 0 1 0-16 0c0 3 2.7 6.9 8 11.7z" />
          </svg>
        </button>
        <button className="btn btn-accent" id="weatherSearchBtn" onClick={handleSearch}>
          Search
        </button>
      </div>

      <div className="panel weather-card brackets" id="weatherCard">
        <div className="w-icon" id="wIcon">
          {getWeatherIcon(weatherState.desc)}
        </div>
        <div className="w-city" id="wCity">
          {weatherState.city}
        </div>
        <div className="w-temp" id="wTemp">
          {weatherState.temp}
        </div>
        <div className="w-desc" id="wDesc">
          {weatherState.desc}
        </div>
        
        <div className="w-grid">
          <div className="w-stat">
            <div className="v" id="wFeels">
              {weatherState.feelsLike}
            </div>
            <div className="l">Feels Like</div>
          </div>
          <div className="w-stat">
            <div className="v" id="wHumidity">
              {weatherState.humidity}
            </div>
            <div className="l">Humidity</div>
          </div>
          <div className="w-stat">
            <div className="v" id="wWind">
              {weatherState.windSpeed}
            </div>
            <div className="l">Wind</div>
          </div>
        </div>

        {weatherState.hourly && weatherState.hourly.length > 0 && (
          <div className="w-hourly" id="wHourly">
            {weatherState.hourly.map((h, i) => (
              <div key={i} className="w-hour">
                <div className="t">{h.time}</div>
                <div className="v2">{h.temp}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
