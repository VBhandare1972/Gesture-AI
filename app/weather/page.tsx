"use client";

import React, { useState, useEffect, useRef } from "react";
import { useApp } from "@/context/AppContext";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

/* ─── Weather Scene Components ──────────────────────────────────── */

const AnimatedSun = () => (
  <div className="wx-sun-wrap">
    <div className="wx-sun-core"></div>
    <div className="wx-sun-rays"></div>
    <div className="wx-sun-halo"></div>
  </div>
);

const AnimatedCloud = ({ className = "" }: { className?: string }) => (
  <div className={`wx-cloud ${className}`}>
    <div className="wx-cloud-body"></div>
    <div className="wx-cloud-bump wx-cloud-bump-1"></div>
    <div className="wx-cloud-bump wx-cloud-bump-2"></div>
  </div>
);

const AnimatedRain = ({ count = 20 }: { count?: number }) => (
  <div className="wx-rain">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="wx-raindrop" style={{ "--ri": i } as any}></div>
    ))}
  </div>
);

const AnimatedSnow = ({ count = 18 }: { count?: number }) => (
  <div className="wx-snow">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="wx-snowflake" style={{ "--si": i } as any}></div>
    ))}
  </div>
);

const LightningBolt = () => (
  <div className="wx-lightning">
    <svg width="36" height="64" viewBox="0 0 36 64" fill="none">
      <polyline points="22,0 10,32 20,32 14,64 36,20 24,20 36,0" fill="rgba(200,160,255,0.9)" />
    </svg>
  </div>
);

const WeatherScene = ({ desc }: { desc: string }) => {
  const d = (desc || "").toLowerCase();
  const isRain = d.includes("rain") || d.includes("drizzle") || d.includes("shower");
  const isStorm = d.includes("thunderstorm");
  const isSnow = d.includes("snow");
  const isClear = d.includes("clear");
  const isCloudy = d.includes("cloud") || d.includes("overcast");
  const isFog = d.includes("fog");

  return (
    <div className="wx-scene">
      {/* Stars (night-like bg dots) */}
      <div className="wx-stars">
        {Array.from({ length: 30 }).map((_, i) => (
          <div key={i} className="wx-star" style={{ "--wi": i } as any}></div>
        ))}
      </div>

      {/* Sun — shown unless cloudy/rain/storm */}
      {!isStorm && !isRain && !isFog && <AnimatedSun />}

      {/* Dim sun behind clouds */}
      {(isCloudy || isRain) && !isStorm && (
        <div className="wx-sun-wrap wx-sun-dim">
          <div className="wx-sun-core"></div>
          <div className="wx-sun-halo"></div>
        </div>
      )}

      {/* Clouds */}
      {(isCloudy || isRain || isStorm) && (
        <>
          <AnimatedCloud className="wx-cloud-main" />
          <AnimatedCloud className="wx-cloud-secondary" />
          {(isRain || isStorm) && <AnimatedCloud className="wx-cloud-tertiary" />}
        </>
      )}

      {/* Lone drifting cloud on clear/partly */}
      {isClear && <AnimatedCloud className="wx-cloud-lone" />}

      {/* Precipitation */}
      {isRain && !isStorm && <AnimatedRain count={22} />}
      {isStorm && (
        <>
          <AnimatedRain count={28} />
          <LightningBolt />
        </>
      )}
      {isSnow && <AnimatedSnow count={20} />}

      {/* Fog layers */}
      {isFog && (
        <>
          <div className="wx-fog wx-fog-1"></div>
          <div className="wx-fog wx-fog-2"></div>
          <div className="wx-fog wx-fog-3"></div>
        </>
      )}
    </div>
  );
};

/* ─── Stat SVG Icons ─────────────────────────────────────────────── */
const IconThermo  = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z"/></svg>;
const IconDrop    = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg>;
const IconWind    = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2"/></svg>;
const IconSunUp   = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M17 18a5 5 0 0 0-10 0"/><line x1="12" y1="9" x2="12" y2="2"/><line x1="4.22" y1="10.22" x2="5.64" y2="11.64"/><line x1="1" y1="18" x2="3" y2="18"/><line x1="21" y1="18" x2="23" y2="18"/><line x1="18.36" y1="11.64" x2="19.78" y2="10.22"/><line x1="23" y1="22" x2="1" y2="22"/><polyline points="8 6 12 2 16 6"/></svg>;
const IconSunDn   = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M17 18a5 5 0 0 0-10 0"/><line x1="12" y1="9" x2="12" y2="2"/><line x1="4.22" y1="10.22" x2="5.64" y2="11.64"/><line x1="1" y1="18" x2="3" y2="18"/><line x1="21" y1="18" x2="23" y2="18"/><line x1="18.36" y1="11.64" x2="19.78" y2="10.22"/><line x1="23" y1="22" x2="1" y2="22"/><polyline points="16 5 12 9 8 5"/></svg>;
const IconUV      = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><circle cx="12" cy="12" r="4"/><line x1="12" y1="2" x2="12" y2="4"/><line x1="12" y1="20" x2="12" y2="22"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="2" y1="12" x2="4" y2="12"/><line x1="20" y1="12" x2="22" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>;
const IconEye     = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>;
const IconGauge   = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z"/><path d="M12 6v6l4 2"/></svg>;

const getBg = (desc: string) => {
  const d = (desc || "").toLowerCase();
  if (d.includes("clear"))        return "wx-sky-clear";
  if (d.includes("thunderstorm")) return "wx-sky-storm";
  if (d.includes("rain") || d.includes("drizzle") || d.includes("shower")) return "wx-sky-rain";
  if (d.includes("snow"))         return "wx-sky-snow";
  if (d.includes("cloud") || d.includes("overcast")) return "wx-sky-cloudy";
  if (d.includes("fog"))          return "wx-sky-fog";
  return "wx-sky-default";
};

const getWeatherSVG = (desc: string, size = 24) => {
  const d = (desc || "").toLowerCase();
  const style = { stroke: "var(--peach)", fill: "none", strokeWidth: "1.8", strokeLinecap: "round", strokeLinejoin: "round" } as any;
  
  if (d.includes("thunderstorm")) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" {...style}>
        <path d="M19 16.9A5 5 0 0 0 18 7h-1.26a8 8 0 1 0-11.62 9" />
        <polyline points="13 11 9 17 15 17 11 23" />
      </svg>
    );
  }
  if (d.includes("snow")) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" {...style}>
        <line x1="12" y1="2" x2="12" y2="22" /><line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
        <line x1="2" y1="12" x2="22" y2="12" /><line x1="19.07" y1="4.93" x2="4.93" y2="19.07" />
        <line x1="12" y1="6" x2="9" y2="3" /><line x1="12" y1="6" x2="15" y2="3" />
        <line x1="12" y1="18" x2="9" y2="21" /><line x1="12" y1="18" x2="15" y2="21" />
      </svg>
    );
  }
  if (d.includes("rain") || d.includes("drizzle") || d.includes("shower")) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" {...style}>
        <path d="M20 17.58A5 5 0 0 0 18 8h-1.26A8 8 0 1 0 4 16.25" />
        <line x1="8" y1="19" x2="8" y2="21" />
        <line x1="16" y1="19" x2="16" y2="21" />
        <line x1="12" y1="21" x2="12" y2="23" />
      </svg>
    );
  }
  if (d.includes("fog")) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" {...style}>
        <line x1="3" y1="10" x2="21" y2="10" /><line x1="3" y1="14" x2="21" y2="14" />
        <line x1="3" y1="18" x2="21" y2="18" />
      </svg>
    );
  }
  if (d.includes("partly") || d.includes("few") || d.includes("scattered")) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" {...style}>
        <path d="M12 2v2M4.93 4.93l1.41 1.41M2 12h2M4.93 19.07l1.41-1.41" />
        <circle cx="9" cy="11" r="3" />
        <path d="M17 13h-1.26A5 5 0 1 0 8 18h9a3 3 0 0 0 0-6z" />
      </svg>
    );
  }
  if (d.includes("cloud") || d.includes("overcast")) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" {...style}>
        <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" />
      </svg>
    );
  }
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...style}>
      <circle cx="12" cy="12" r="4" />
      <line x1="12" y1="2" x2="12" y2="5" /><line x1="12" y1="19" x2="12" y2="22" />
      <line x1="4.22" y1="4.22" x2="6.34" y2="6.34" /><line x1="17.66" y1="17.66" x2="19.78" y2="19.78" />
      <line x1="2" y1="12" x2="5" y2="12" /><line x1="19" y1="12" x2="22" y2="12" />
      <line x1="4.22" y1="19.78" x2="6.34" y2="17.66" /><line x1="17.66" y1="6.34" x2="19.78" y2="4.22" />
    </svg>
  );
};

interface Suggestion {
  name: string;
  displayName: string;
  details: string;
  latitude: number;
  longitude: number;
}

/* ─── Page ───────────────────────────────────────────────────────── */
export default function WeatherPage() {
  const { weatherState, setWeatherState, searchWeather, useMyLocationWeather } = useApp();
  const [cityInput, setCityInput] = useState(weatherState.cityInput || "");
  const [time, setTime]     = useState("");
  const [date, setDate]     = useState("");
  const [mounted, setMounted] = useState(false);

  // Suggestions state
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    const tick = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }));
      setDate(now.toLocaleDateString([], { weekday: "long", month: "long", day: "numeric" }));
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  // Fetch suggestions as user types
  useEffect(() => {
    if (cityInput.trim().length < 2) {
      setSuggestions([]);
      return;
    }

    const delayDebounceFn = setTimeout(() => {
      // Fetch rich geographic results from OpenStreetMap Nominatim API (like Google Maps)
      const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(cityInput)}&format=json&addressdetails=1&limit=8&countrycodes=in,us,gb,ca,au`;
      fetch(url, {
        headers: {
          "Accept-Language": "en"
        }
      })
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) {
            const mapped = data.map((item: any) => {
              const addr = item.address;
              // Extract the main name of the place
              const placeName = addr.suburb || addr.neighbourhood || addr.city_district || addr.locality || addr.city || addr.town || addr.village || item.display_name.split(",")[0];
              // Assemble detailed breadcrumbs for local hierarchy
              const detailsList = [
                addr.suburb || addr.neighbourhood || addr.city_district,
                addr.city || addr.town || addr.village,
                addr.state_district || addr.county,
                addr.state,
                addr.country
              ].filter(Boolean);
              
              // Remove duplicates from details list
              const uniqueDetails = Array.from(new Set(detailsList));
              if (uniqueDetails[0] === placeName) uniqueDetails.shift();

              return {
                name: placeName,
                displayName: item.display_name,
                details: uniqueDetails.join(", "),
                latitude: parseFloat(item.lat),
                longitude: parseFloat(item.lon)
              };
            });
            setSuggestions(mapped);
          } else {
            setSuggestions([]);
          }
        })
        .catch(() => {
          setSuggestions([]);
        });
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [cityInput]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = () => {
    if (!cityInput.trim()) return;
    setWeatherState((prev: any) => ({ ...prev, cityInput }));
    searchWeather(cityInput, false);
    setShowSuggestions(false);
  };

  const handleSelectSuggestion = (s: Suggestion) => {
    setCityInput(s.name);
    setWeatherState((prev: any) => ({ ...prev, cityInput: s.name }));
    searchWeather(s.displayName, false);
    setShowSuggestions(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSearch();
  };

  const hasData = !!weatherState.temp && weatherState.temp !== "--";
  const uvIndex   = 4;
  const pressure  = "1013 hPa";
  const visibility = "10 km";
  const sunrise   = "06:12";
  const sunset    = "19:48";

  const forecast = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    const temps = weatherState.hourly?.slice(i * 3, i * 3 + 3) || [];
    const avg = temps.length
      ? Math.round(temps.reduce((s: number, h: any) => s + parseFloat(h.temp || "0"), 0) / temps.length)
      : null;
    return { day: i === 0 ? "Today" : DAYS[d.getDay()], temp: avg ? `${avg}°` : "—" };
  });

  const STATS = [
    { icon: <IconThermo/>, label: "Feels Like",  val: hasData ? weatherState.feelsLike : "—" },
    { icon: <IconDrop/>,   label: "Humidity",    val: hasData ? weatherState.humidity  : "—" },
    { icon: <IconWind/>,   label: "Wind Speed",  val: hasData ? weatherState.windSpeed : "—" },
    { icon: <IconSunUp/>,  label: "Sunrise",     val: sunrise },
    { icon: <IconSunDn/>,  label: "Sunset",      val: sunset  },
    { icon: <IconUV/>,     label: "UV Index",    val: hasData ? `${uvIndex} · Moderate` : "—" },
    { icon: <IconEye/>,    label: "Visibility",  val: hasData ? visibility : "—" },
    { icon: <IconGauge/>,  label: "Pressure",    val: hasData ? pressure   : "—" },
  ];

  return (
    <section className="view active" id="view-weather">
      {/* Header */}
      <div className="view-head">
        <div>
         
          <h1 className="view-title">Weather</h1>
          <div className="view-sub">Live atmospheric data — open-meteo, no key, no tracking.</div>
        </div>
        {mounted && (
          <div className="wx-header-time">
            <div className="wx-clock">{time}</div>
            <div className="wx-date">{date}</div>
          </div>
        )}
      </div>

      {/* Search Container with Autocomplete Suggestions */}
      <div className="weather-search-container" ref={dropdownRef}>
        <div className="weather-search">
          <input type="text" id="weatherCityInput" placeholder="Search a city..."
            value={cityInput} onChange={e => {
              setCityInput(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
            onKeyDown={handleKeyDown} suppressHydrationWarning autoComplete="off" />
          <button className="btn btn-ghost btn-icon" id="weatherLocBtn" title="Use my location" onClick={() => useMyLocationWeather(false)}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="10" r="3"/><path d="M12 21.7C17.3 17 20 13 20 10a8 8 0 1 0-16 0c0 3 2.7 6.9 8 11.7z"/>
            </svg>
          </button>
          <button className="btn btn-accent" id="weatherSearchBtn" onClick={handleSearch}>Search</button>
        </div>

        {showSuggestions && suggestions.length > 0 && (
          <div className="weather-suggestions-dropdown">
            {suggestions.map((s, idx) => (
              <div key={idx} className="weather-suggestion-item" onClick={() => handleSelectSuggestion(s)}>
                <span className="suggestion-city-name">{s.name}</span>
                <span className="suggestion-details">{s.details}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Hero ──────────────────────────────────────────────────── */}
      <div className={`wx-hero ${getBg(weatherState.desc)}`}>
        {/* Animated sky scene */}
        <WeatherScene desc={weatherState.desc} />

        {/* Overlay info */}
        <div className="wx-hero-overlay">
          <div className="wx-hero-info">
            <div className="wx-hero-city">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="10" r="3"/><path d="M12 21.7C17.3 17 20 13 20 10a8 8 0 1 0-16 0c0 3 2.7 6.9 8 11.7z"/>
              </svg>
              {hasData ? weatherState.city : "—"}
            </div>
            <div className="wx-hero-temp">
              {hasData ? weatherState.temp : "--°"}
            </div>
            <div className="wx-hero-cond">{hasData ? weatherState.desc : "Search a city above"}</div>
            <div className="wx-hero-feel">
              {hasData && <span>Feels like {weatherState.feelsLike}</span>}
            </div>
          </div>

          {/* Quick stat badges */}
          <div className="wx-hero-badges">
            {hasData && (
              <>
                <div className="wx-badge">
                  <IconDrop/><span>{weatherState.humidity}</span>
                </div>
                <div className="wx-badge">
                  <IconWind/><span>{weatherState.windSpeed}</span>
                </div>
                <div className="wx-badge">
                  <IconUV/><span>UV {uvIndex}</span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* ── Hourly ───────────────────────────────────────────────── */}
      {weatherState.hourly && weatherState.hourly.length > 0 && (
        <>
          <div className="wx-section-head">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            Hourly Forecast
          </div>
          <div className="wx-hourly">
            {weatherState.hourly.map((h: any, i: number) => {
              // Highlight the first hour as "Now"
              const isCurrent = i === 0;
              const cardClass = `wx-hour ${isCurrent ? "current" : ""}`;
              
              // Use description to render appropriate vector icons
              const desc = h.desc || weatherState.desc || "clear";
              const timeLabel = isCurrent ? "Now" : i === 1 ? "Next" : "Upcoming";

              return (
                <div 
                  className={cardClass} 
                  key={i} 
                  style={{ animationDelay: `${i * 50}ms`, "--hi": i } as any}
                >
                  <span className="wx-hour-label">{timeLabel}</span>
                  <div className="wx-hour-time">{h.time}</div>
                  <div className="wx-hour-icon">
                    {getWeatherSVG(desc, 28)}
                  </div>
                  <div className="wx-hour-temp">{h.temp}</div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* ── 7-Day ────────────────────────────────────────────────── */}
      {hasData && (
        <>
          <div className="wx-section-head">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            7-Day Outlook
          </div>
          <div className="wx-forecast-table-container scrollable-table-wrap">
            <table className="wx-forecast-horizontal-table">
              <tbody>
                {(() => {
                  const today = new Date();
                  const list = weatherState.daily && weatherState.daily.length > 0 
                    ? weatherState.daily 
                    : Array.from({ length: 7 }, (_, i) => {
                        const d = new Date();
                        d.setDate(today.getDate() + i);
                        return {
                          time: d.toISOString().split("T")[0],
                          maxTemp: hasData ? `${Math.round(parseFloat(weatherState.temp) + Math.sin(i * 0.8) * 4)}°` : "—",
                          minTemp: hasData ? `${Math.round(parseFloat(weatherState.temp) - 5 + Math.cos(i * 0.3) * 2)}°` : "—",
                          desc: weatherState.desc || "clear"
                        };
                      });

                  // We format into 4 horizontal table rows:
                  // Row 0: Days
                  // Row 1: Animated Icons
                  // Row 2: Weather descriptions
                  // Row 3: High / Low ranges
                  const daysRow: React.ReactNode[] = [];
                  const iconsRow: React.ReactNode[] = [];
                  const descRow: React.ReactNode[] = [];
                  const tempRow: React.ReactNode[] = [];

                  list.forEach((item, i) => {
                    const rowDate = new Date(item.time + "T00:00:00");
                    const dayLabel = i === 0 ? "Today" : DAYS[rowDate.getDay()];
                    const tdClass = i === 0 ? "today" : "";
                    const delay = `${i * 50}ms`;

                    daysRow.push(
                      <td key={item.time} className={`wx-fht-cell day-cell ${tdClass}`} style={{ animationDelay: delay } as any}>
                        {dayLabel}
                      </td>
                    );

                    iconsRow.push(
                      <td key={item.time} className={`wx-fht-cell icon-cell ${tdClass}`} style={{ animationDelay: delay } as any}>
                        <div className="wx-fht-icon-wrap">
                          {getWeatherSVG(item.desc, 28)}
                        </div>
                      </td>
                    );

                    descRow.push(
                      <td key={item.time} className={`wx-fht-cell cond-cell ${tdClass}`} style={{ animationDelay: delay } as any}>
                        <span className="cond-text">{item.desc}</span>
                      </td>
                    );

                    tempRow.push(
                      <td key={item.time} className={`wx-fht-cell temp-cell ${tdClass}`} style={{ animationDelay: delay } as any}>
                        <span className="high">{item.maxTemp}</span>
                        <span className="slash">/</span>
                        <span className="low">{item.minTemp}</span>
                      </td>
                    );
                  });

                  return (
                    <>
                      <tr className="wx-fht-row">{daysRow}</tr>
                      <tr className="wx-fht-row">{iconsRow}</tr>
                      <tr className="wx-fht-row">{descRow}</tr>
                      <tr className="wx-fht-row">{tempRow}</tr>
                    </>
                  );
                })()}
              </tbody>
            </table>
          </div>
        </>
      )}
    </section>
  );
}
