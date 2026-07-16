"use client";

import React, { createContext, useContext, useState, useEffect, useRef, ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "./AuthContext";
import { useGestureEngine } from "./GestureEngine";

export interface Track {
  name: string;
  sub: string;
  freqs: number[];
  type: "sine" | "square" | "sawtooth" | "triangle";
  lfo: number;
}

export interface SongTrack {
  id: string;
  name: string;
  artist: string;
  movie: string;
}

export interface ToastItem {
  id: string;
  msg: string;
  fade: boolean;
}

export interface CmdLogEntry {
  who: string;
  text: string;
  time: Date;
}

export interface NoteItem {
  id: number;
  title: string;
  body: string;
  time: string;
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface AppSettings {
  voiceOut: boolean;
  gesture: boolean;
  sensitivity: number;
  continuous: boolean;
  theme: string;
}

export interface AppContextType {
  booting: boolean;
  onboardingOpen: boolean;
  setOnboardingOpen: (open: boolean) => void;
  currentTime: string;
  currentDate: string;
  uptimeStr: string;
  getGreeting: () => string;
  toasts: ToastItem[];
  showToast: (msg: string) => void;
  activeView: string;
  navigate: (view: string) => void;
  stats: { commands: number; drawings: number };
  setStats: React.Dispatch<React.SetStateAction<{ commands: number; drawings: number }>>;
  cmdLogEntries: CmdLogEntry[];
  logCommand: (who: string, text: string) => void;
  parseCommand: (rawText: string, source: string) => void;
  notes: NoteItem[];
  addNote: (title: string, body: string) => void;
  updateNote: (id: number, title: string, body: string) => void;
  deleteNote: (id: number) => void;
  chatHistory: ChatMessage[];
  isTyping: boolean;
  sendChatMessage: (text: string) => void;
  clearChat: () => void;
  chatOpen: boolean;
  setChatOpen: (open: boolean) => void;
  settings: AppSettings;
  setSettings: React.Dispatch<React.SetStateAction<AppSettings>>;
  musicState: {
    playing: boolean;
    mode: string;
    trackIndex: number;
    hindiIndex: number;
    englishIndex: number;
    playingMode: string;
    playingTrackIndex: number;
    playingHindiIndex: number;
    playingEnglishIndex: number;
    volume: number;
    trackTime: string;
  };
  setMusicState: React.Dispatch<
    React.SetStateAction<{
      playing: boolean;
      mode: string;
      trackIndex: number;
      hindiIndex: number;
      englishIndex: number;
      playingMode: string;
      playingTrackIndex: number;
      playingHindiIndex: number;
      playingEnglishIndex: number;
      volume: number;
      trackTime: string;
    }>
  >;
  vizHeights: number[];
  playMusic: () => void;
  pauseMusic: () => void;
  nextTrack: () => void;
  prevTrack: () => void;
  setMusicVolume: (v: number) => void;
  switchMusicMode: (mode: string) => void;
  rpsState: {
    wins: number;
    losses: number;
    ties: number;
    playerChoice: string;
    aiChoice: string;
    result: string;
    countdown: number | string | null;
    playingRound: boolean;
  };
  setRpsState: React.Dispatch<
    React.SetStateAction<{
      wins: number;
      losses: number;
      ties: number;
      playerChoice: string;
      aiChoice: string;
      result: string;
      countdown: number | string | null;
      playingRound: boolean;
    }>
  >;
  playRPSRound: (playerChoice: "rock" | "paper" | "scissors") => void;
  runRPSGestureRound: () => void;
  weatherState: {
    cityInput: string;
    city: string;
    temp: string;
    desc: string;
    feelsLike: string;
    humidity: string;
    windSpeed: string;
    hourly: Array<{ time: string; temp: string }>;
    daily?: Array<{ time: string; maxTemp: string; minTemp: string; desc: string }>;
    isDay?: number;
    weatherLastCity: string | null;
    lastWeatherSummary: string | null;
  };
  setWeatherState: React.Dispatch<
    React.SetStateAction<{
      cityInput: string;
      city: string;
      temp: string;
      desc: string;
      feelsLike: string;
      humidity: string;
      windSpeed: string;
      hourly: Array<{ time: string; temp: string }>;
      daily?: Array<{ time: string; maxTemp: string; minTemp: string; desc: string }>;
      isDay?: number;
      weatherLastCity: string | null;
      lastWeatherSummary: string | null;
    }>
  >;
  searchWeather: (city: string, triggerSpeech?: boolean) => void;
  useMyLocationWeather: (triggerSpeech?: boolean) => void;
  voiceState: {
    listening: boolean;
    mode: string;
    interimTranscript: string;
    captionVisible: boolean;
  };
  startListening: (mode?: string) => void;
  stopListening: () => void;
  toggleCommandMic: () => void;
  speak: (text: string) => void;
  gestureHUDMinimized: boolean;
  setGestureHUDMinimized: (min: boolean) => void;
  gestureLabel: string;
  gestureCursor: { x: number; y: number; show: boolean; pinched: boolean };
  ripples: Array<{ id: number; x: number; y: number }>;
  gestureConfidencePct: number;
  recentGestures: string[];
  enableGestureCamera: (videoEl: HTMLVideoElement, canvasEl: HTMLCanvasElement) => Promise<void>;
  disableGestureCamera: () => void;
  stopCameraOnly: () => void;
  lastGesture: string | null;
}

const AppContext = createContext<AppContextType | null>(null);

export const TRACKS: Track[] = [
  { name: "Arc Pulse", sub: "Ambient · Sine drone", freqs: [110.0, 164.81, 220.0], type: "sine", lfo: 0.15 },
  { name: "Repulsor Drift", sub: "Ambient · Triangle pad", freqs: [98.0, 146.83, 196.0], type: "triangle", lfo: 0.08 },
  { name: "Mark Forty-Two", sub: "Ambient · Saw shimmer", freqs: [130.81, 196.0, 261.63], type: "sawtooth", lfo: 0.22 },
];

export const HINDI_TRACKS: SongTrack[] = [
  { id: "BddP6PYo2gs", name: "Kesariya", artist: "Arijit Singh", movie: "Brahmāstra" },
  { id: "IJq0yyWug1k", name: "Tum Hi Ho", artist: "Arijit Singh", movie: "Aashiqui 2" },
  { id: "bzSTpdcs-EI", name: "Channa Mereya", artist: "Arijit Singh", movie: "Ae Dil Hai Mushkil" },
  { id: "FdfS97c0U4g", name: "Ishq Bulaava", artist: "Sanam Puri, Shipra Goyal", movie: "Hasee Toh Phasee" },
  { id: "hXn3x01LaWw", name: "Ok Jaanu (Title Track)", artist: "A.R. Rahman, Srinidhi", movie: "Ok Jaanu" }
];

export const ENGLISH_TRACKS: SongTrack[] = [
  { id: "4NRXx6U8ABQ", name: "Blinding Lights", artist: "The Weeknd", movie: "After Hours" },
  { id: "JGwWNGJdvx8", name: "Shape of You", artist: "Ed Sheeran", movie: "Divide" },
  { id: "kTJczUoc26U", name: "Stay", artist: "The Kid LAROI & Justin Bieber", movie: "F*CK LOVE 3" },
  { id: "2Vv-BfVoq4g", name: "Perfect", artist: "Ed Sheeran", movie: "Divide" },
  { id: "3AtDnEC4zak", name: "We Don't Talk Anymore", artist: "Charlie Puth ft. Selena Gomez", movie: "Nine Track Mind" },
  { id: "7wtfhZwyrcc", name: "Believer", artist: "Imagine Dragons", movie: "Evolve" },
  { id: "09R8_2nJtjg", name: "Sugar", artist: "Maroon 5", movie: "V" },
  { id: "kJQP7kiw5Fk", name: "Despacito", artist: "Luis Fonsi ft. Daddy Yankee", movie: "Vida" },
  { id: "oyEuk8j8imI", name: "Love Yourself", artist: "Justin Bieber", movie: "Purpose" },
  { id: "50VNCymT-As", name: "Let Me Down Slowly", artist: "Alec Benjamin", movie: "Narrated for You" }
];

export function AppContextProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useAuth();

  const [booting, setBooting] = useState(true);
  const [onboardingOpen, setOnboardingOpen] = useState(false);

  const [currentTime, setCurrentTime] = useState("");
  const [currentDate, setCurrentDate] = useState("");
  const [uptimeStr, setUptimeStr] = useState("00:00");
  const startTimeRef = useRef<number | null>(null);

  const [stats, setStats] = useState({ commands: 0, drawings: 0 });
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [cmdLogEntries, setCmdLogEntries] = useState<CmdLogEntry[]>([]);
  const [notes, setNotes] = useState<NoteItem[]>([]);
  
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [chatOpen, setChatOpen] = useState(false);

  useEffect(() => {
    if (user?.displayName) {
      const firstName = user.displayName.split(" ")[0];
      setChatHistory([{ role: "assistant", content: `Welcome back, ${firstName}. All systems are online.` }]);
    } else {
      setChatHistory([{ role: "assistant", content: `Welcome. All systems are online.` }]);
    }
  }, [user]);
  const [isTyping, setIsTyping] = useState(false);

  const [settings, setSettings] = useState<AppSettings>({
    voiceOut: true,
    gesture: false,
    sensitivity: 5,
    continuous: true,
    theme: "cream",
  });

  const [musicState, setMusicState] = useState({
    playing: false,
    mode: "english",
    trackIndex: 0,
    hindiIndex: 0,
    englishIndex: 0,
    playingMode: "english",
    playingTrackIndex: 0,
    playingHindiIndex: 0,
    playingEnglishIndex: 0,
    volume: 55,
    trackTime: "00:00",
  });

  const musicPlayingRef = useRef(false);
  const musicModeRef = useRef("english");
  const trackIndexRef = useRef(0);
  const hindiIndexRef = useRef(0);
  const englishIndexRef = useRef(0);
  const musicVolumeRef = useRef(0.55);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const oscillatorsRef = useRef<any[] | null>(null);
  const musicTimerIntRef = useRef<any>(null);
  const ytPlayerRef = useRef<any>(null);
  const ytPlayerPromiseRef = useRef<Promise<any> | null>(null);

  const [vizHeights, setVizHeights] = useState<number[]>(Array(28).fill(6));
  const vizRafRef = useRef<number | null>(null);
  const fakeVizIntRef = useRef<any>(null);

  const [rpsState, setRpsState] = useState<{
    wins: number;
    losses: number;
    ties: number;
    playerChoice: string;
    aiChoice: string;
    result: string;
    countdown: number | string | null;
    playingRound: boolean;
  }>({
    wins: 0,
    losses: 0,
    ties: 0,
    playerChoice: "?",
    aiChoice: "?",
    result: "Show a gesture and hit Play, or pick your move below.",
    countdown: null,
    playingRound: false,
  });

  const [weatherState, setWeatherState] = useState<{
    cityInput: string;
    city: string;
    temp: string;
    desc: string;
    feelsLike: string;
    humidity: string;
    windSpeed: string;
    hourly: Array<{ time: string; temp: string }>;
    daily?: Array<{ time: string; maxTemp: string; minTemp: string; desc: string }>;
    isDay?: number;
    weatherLastCity: string | null;
    lastWeatherSummary: string | null;
  }>({
    cityInput: "",
    city: "Search a city to begin",
    temp: "--°",
    desc: "Awaiting telemetry...",
    feelsLike: "--°",
    humidity: "--%",
    windSpeed: "-- km/h",
    hourly: [],
    daily: [],
    isDay: 1,
    weatherLastCity: null,
    lastWeatherSummary: null,
  });
  const weatherStateRef = useRef(weatherState);
  useEffect(() => {
    weatherStateRef.current = weatherState;
  }, [weatherState]);

  const [voiceState, setVoiceState] = useState({
    listening: false,
    mode: "command",
    interimTranscript: "",
    captionVisible: false,
  });
  const voiceStateRef = useRef(voiceState);
  useEffect(() => {
    voiceStateRef.current = voiceState;
  }, [voiceState]);
  const recognitionRef = useRef<any>(null);
  const cachedVoicesRef = useRef<SpeechSynthesisVoice[]>([]);

  const [gestureHUDMinimized, setGestureHUDMinimized] = useState(false);
  const pathnameRef = useRef(pathname);
  useEffect(() => {
    pathnameRef.current = pathname;
  }, [pathname]);

  const showToast = (msg: string) => {
    const id = Date.now() + Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, msg, fade: false }]);
    setTimeout(() => {
      setToasts((prev) => prev.map((t) => (t.id === id ? { ...t, fade: true } : t)));
    }, 900);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 1500);
  };

  const speak = (text: string) => {
    if (!settings.voiceOut || typeof window === "undefined" || !window.speechSynthesis || !text) return;
    try {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.rate = 1.02;
      u.pitch = 0.92;
      u.volume = 1;

      if (cachedVoicesRef.current.length === 0) {
        cachedVoicesRef.current = window.speechSynthesis.getVoices() || [];
      }
      const preferred =
        cachedVoicesRef.current.find((v) =>
          /en/i.test(v.lang) && /male|daniel|david|google uk english male|arthur/i.test(v.name)
        ) || cachedVoicesRef.current.find((v) => /en/i.test(v.lang));

      if (preferred) u.voice = preferred;
      window.speechSynthesis.speak(u);
    } catch (e) {
      console.error(e);
    }
  };

  const logCommand = (who: string, text: string) => {
    setStats((prev) => ({ ...prev, commands: prev.commands + 1 }));
    setCmdLogEntries((prev) => {
      const newLogs = [{ who, text, time: new Date() }, ...prev];
      return newLogs.slice(0, 8);
    });
  };

  useEffect(() => {
    startTimeRef.current = Date.now();

    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString([], { hour12: false }));
      setCurrentDate(now.toLocaleDateString([], { weekday: "long", month: "long", day: "numeric" }));

      if (startTimeRef.current) {
        const diff = Date.now() - startTimeRef.current;
        const s = Math.floor(diff / 1000);
        const m = Math.floor(s / 60).toString().padStart(2, "0");
        const ss = (s % 60).toString().padStart(2, "0");
        setUptimeStr(`${m}:${ss}`);
      }
    }, 1000);

    const bootTimer = setTimeout(() => {
      setBooting(false);
      const onboardingShowTimer = setTimeout(() => {
        setOnboardingOpen(true);
      }, 500);
      return () => clearTimeout(onboardingShowTimer);
    }, 1200);

    if (typeof window !== "undefined" && window.speechSynthesis) {
      cachedVoicesRef.current = window.speechSynthesis.getVoices() || [];
      window.speechSynthesis.onvoiceschanged = () => {
        cachedVoicesRef.current = window.speechSynthesis.getVoices() || [];
      };
    }

    return () => {
      clearInterval(timer);
      clearTimeout(bootTimer);
      stopListening();
      stopAudio();
    };
  }, []);

  useEffect(() => {
    const THEME_COLORS: Record<string, { accent: string; soft: string; faint: string }> = {
      cream: { accent: "#fed0bb", soft: "rgba(254,208,187,0.22)", faint: "rgba(254,208,187,0.09)" },
      mauve: { accent: "#fcb9b2", soft: "rgba(252,185,178,0.22)", faint: "rgba(252,185,178,0.09)" },
      wine: { accent: "#b23a48", soft: "rgba(178,58,72,0.22)", faint: "rgba(178,58,72,0.09)" },
    };
    const c = THEME_COLORS[settings.theme] || THEME_COLORS.cream;
    if (typeof document !== "undefined") {
      document.documentElement.style.setProperty("--red", c.accent);
      document.documentElement.style.setProperty("--red-soft", c.soft);
      document.documentElement.style.setProperty("--red-faint", c.faint);
    }
  }, [settings.theme]);

  const getGreeting = () => {
    if (typeof Date === "undefined") return "GOOD DAY, ";
    const h = new Date().getHours();
    return h < 5 ? "STILL UP, " : h < 12 ? "GOOD MORNING, " : h < 17 ? "GOOD AFTERNOON, " : "GOOD EVENING, ";
  };

  const addNote = (title: string, body: string) => {
    const newNote = {
      id: Date.now(),
      title: title || "Untitled",
      body: body || "(no content)",
      time: new Date().toLocaleString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }),
    };
    setNotes((prev) => [newNote, ...prev]);
    showToast("Note saved");
  };

  const updateNote = (id: number, title: string, body: string) => {
    setNotes((prev) =>
      prev.map((n) =>
        n.id === id
          ? { ...n, title: title || "Untitled", body: body || "(no content)" }
          : n
      )
    );
    showToast("Note updated");
  };

  const deleteNote = (id: number) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
  };

  const localResponder = (text: string) => {
    const t = text.toLowerCase();
    if (/\b(hi|hello|hey)\b/.test(t)) return "Hello, User. All systems are green — what can I help you with?";
    if (/who are you|what are you/.test(t)) return "I'm JARVIS, the assistant running this HUD. Voice, gestures, or clicks — I respond to all three.";
    if (/what can you do|capabilities|help me/.test(t)) return "I can open any module — drawing, music, weather, notes, calculator, games — just ask, or try a hand gesture.";
    if (/tell me about ai|artificial intelligence/.test(t)) return "Artificial intelligence is software that learns patterns from data to perform tasks like understanding language, recognizing images, or making predictions.";
    if (/joke/.test(t)) return "Why did the robot go on a diet? Too many bytes.";
    if (/time\b/.test(t)) return `It's currently ${new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}.`;
    if (/date|today/.test(t)) return `Today is ${new Date().toLocaleDateString([], { weekday: "long", month: "long", day: "numeric" })}.`;
    if (/thank/.test(t)) return "Anytime, User.";
    return "I'm running on local logic right now — try asking me to open drawing, music, weather, or any other module.";
  };

  const executeAIAction = (actionStr: string) => {
    const act = actionStr.toLowerCase();
    if (act.startsWith("create_note:")) {
      const content = actionStr.substring(12).trim();
      if (content) {
        addNote("AI Assistant Note", content);
      }
      return;
    }
    if (act.startsWith("change_theme:")) {
      const themeName = act.substring(13).trim() as "cream" | "mauve" | "wine";
      if (["cream", "mauve", "wine"].includes(themeName)) {
        setSettings((prev) => ({ ...prev, theme: themeName }));
        showToast("Theme changed to " + themeName.toUpperCase());
      }
      return;
    }
    switch (act) {
      case "open_draw":
        router.push("/draw");
        showToast("AI: Opening Air Drawing");
        break;
      case "open_weather":
        router.push("/weather");
        showToast("AI: Opening Weather");
        break;
      case "open_music":
        router.push("/music");
        showToast("AI: Opening Music Control");
        break;
      case "open_calculator":
        router.push("/calc");
        showToast("AI: Opening Calculator");
        break;
      case "open_notes":
        router.push("/notes");
        showToast("AI: Opening Notes");
        break;
      case "open_games":
        router.push("/games");
        showToast("AI: Opening Gesture Games");
        break;
      case "open_settings":
        router.push("/settings");
        showToast("AI: Opening Settings");
        break;
      case "open_dashboard":
        router.push("/");
        showToast("AI: Heading Home");
        break;
      case "play_music":
        playMusic();
        showToast("AI: Playing Audio Stream");
        break;
      case "pause_music":
        pauseMusic();
        showToast("AI: Pausing Audio Stream");
        break;
      case "toggle_gesture":
        setSettings((prev) => ({ ...prev, gesture: !prev.gesture }));
        showToast("AI: Toggled Gesture Lens");
        break;
      default:
        break;
    }
  };

  const respondAsAI = async (text: string) => {
    setIsTyping(true);
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userText: text,
          userName: user?.displayName ? user.displayName.split(" ")[0] : null,
          chatHistory: chatHistory.slice(-10).map((m) => ({ role: m.role, content: m.content })),
        }),
      });
      if (!response.ok) throw new Error("API Route failed");
      const data = await response.json();
      const reply = data.reply || "";
      setIsTyping(false);

      // Extract & execute actions
      const actionRegex = /\[ACTION:(.*?)\]/g;
      let match;
      while ((match = actionRegex.exec(reply)) !== null) {
        const actionStr = match[1].trim();
        executeAIAction(actionStr);
      }

      // Clean visible reply
      const cleanReply = reply.replace(/\[ACTION:.*?\]/g, "").trim();

      setChatHistory((prev) => [...prev, { role: "assistant", content: cleanReply }]);
      speak(cleanReply);
    } catch (err) {
      setIsTyping(false);
      const reply = localResponder(text);
      setChatHistory((prev) => [...prev, { role: "assistant", content: reply }]);
      speak(reply);
    }
  };

  const sendChatMessage = (text: string) => {
    if (!text.trim()) return;
    setChatHistory((prev) => [...prev, { role: "user", content: text }]);
    logCommand("CHAT", text);
    respondAsAI(text);
  };

  const clearChat = () => {
    setChatHistory([{ role: "assistant", content: "Chat cleared. Systems online — how can I help, User?" }]);
    showToast("Chat cleared");
  };

  const weatherCodeInfo = (code: number): [string] => {
    const table: Record<number, [string]> = {
      0: ["Clear sky"], 1: ["Mainly clear"], 2: ["Partly cloudy"], 3: ["Overcast"],
      45: ["Fog"], 48: ["Freezing fog"], 51: ["Light drizzle"], 53: ["Drizzle"], 55: ["Dense drizzle"],
      61: ["Light rain"], 63: ["Rain"], 65: ["Heavy rain"], 71: ["Light snow"], 73: ["Snow"], 75: ["Heavy snow"],
      80: ["Rain showers"], 81: ["Rain showers"], 82: ["Violent showers"], 95: ["Thunderstorm"], 96: ["Thunderstorm"], 99: ["Severe thunderstorm"]
    };
    return table[code] || ["Conditions unavailable"];
  };

  const searchWeather = (city: string, triggerSpeech = false) => {
    if (!city) return;
    showToast("Searching for " + city + "...");
    fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1`)
      .then((r) => r.json())
      .then((data) => {
        if (!data.results || !data.results.length) {
          showToast("City not found");
          return;
        }
        const loc = data.results[0];
        const label = [loc.name, loc.admin1, loc.country].filter(Boolean).join(", ");
        fetchForecast(loc.latitude, loc.longitude, label, city, triggerSpeech);
      })
      .catch(() => showToast("Weather lookup failed"));
  };

  const fetchForecast = (lat: number, lon: number, label: string, cityName: string, triggerSpeech = false) => {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,wind_speed_10m,weather_code,is_day&hourly=temperature_2m,weather_code&daily=temperature_2m_max,temperature_2m_min,weather_code&timezone=auto`;
    fetch(url)
      .then((r) => r.json())
      .then((data) => renderWeather(label, data, cityName, triggerSpeech))
      .catch(() => showToast("Forecast unavailable"));
  };

  const renderWeather = (label: string, data: any, cityName: string, triggerSpeech = false) => {
    const cur = data.current;
    const [desc] = weatherCodeInfo(cur.weather_code);
    let startIdx = data.hourly.time.findIndex((t: string) => t >= data.current.time);
    if (startIdx < 0) startIdx = 0;

    const hourlyForecasts = data.hourly.time.slice(startIdx, startIdx + 6).map((t: string, i: number) => {
      const temp = data.hourly.temperature_2m[startIdx + i];
      const hr = new Date(t).getHours();
      return { time: `${hr}:00`, temp: `${Math.round(temp)}°` };
    });

    const dailyForecasts = data.daily ? data.daily.time.map((t: string, i: number) => {
      const code = data.daily.weather_code[i];
      const [desc] = weatherCodeInfo(code);
      return {
        time: t,
        maxTemp: `${Math.round(data.daily.temperature_2m_max[i])}°`,
        minTemp: `${Math.round(data.daily.temperature_2m_min[i])}°`,
        desc: desc
      };
    }) : [];

    const summary = `${label} is ${desc.toLowerCase()} at ${Math.round(cur.temperature_2m)} degrees, feels like ${Math.round(cur.apparent_temperature)}.`;

    setWeatherState((prev) => ({
      ...prev,
      city: label,
      temp: `${Math.round(cur.temperature_2m)}°C`,
      desc: desc,
      feelsLike: `${Math.round(cur.apparent_temperature)}°C`,
      humidity: `${cur.relative_humidity_2m}%`,
      windSpeed: `${Math.round(cur.wind_speed_10m)} km/h`,
      hourly: hourlyForecasts,
      daily: dailyForecasts,
      isDay: cur.is_day !== undefined ? cur.is_day : 1,
      weatherLastCity: cityName,
      lastWeatherSummary: summary,
    }));

    if (triggerSpeech) {
      speak(summary);
    }
  };

  const useMyLocationWeather = (triggerSpeech = false) => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      showToast("Location not supported");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => fetchForecast(pos.coords.latitude, pos.coords.longitude, "Your Location", "Your Location", triggerSpeech),
      () => showToast("Location permission denied")
    );
  };

  useEffect(() => {
    musicPlayingRef.current = musicState.playing;
    musicModeRef.current = musicState.playingMode;
    trackIndexRef.current = musicState.playingTrackIndex;
    hindiIndexRef.current = musicState.playingHindiIndex;
    englishIndexRef.current = musicState.playingEnglishIndex;
    musicVolumeRef.current = musicState.volume / 100;
  }, [musicState]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      (window as any)._ytPlayerPromiseReset = () => {
        if (ytPlayerRef.current) {
          try {
            if (ytPlayerRef.current.destroy) {
              ytPlayerRef.current.destroy();
            }
          } catch (e) {}
          ytPlayerRef.current = null;
        }
        ytPlayerPromiseRef.current = null;
      };
      (window as any).stopAudio = () => {
        stopAudio();
        setMusicState((prev) => ({ ...prev, playing: false, trackTime: "00:00" }));
      };
    }
  }, []);

  const ensureAudioContext = () => {
    if (typeof window === "undefined") return;
    if (!audioCtxRef.current) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      audioCtxRef.current = new AudioContextClass();
      masterGainRef.current = audioCtxRef.current!.createGain();
      masterGainRef.current!.gain.value = musicVolumeRef.current;
      analyserRef.current = audioCtxRef.current!.createAnalyser();
      analyserRef.current!.fftSize = 64;
      masterGainRef.current!.connect(analyserRef.current!);
      masterGainRef.current!.connect(audioCtxRef.current!.destination);
    }
    if (audioCtxRef.current!.state === "suspended") {
      audioCtxRef.current!.resume();
    }
  };

  const stopOscillators = () => {
    if (oscillatorsRef.current) {
      oscillatorsRef.current.forEach((o) => {
        try { o.osc.stop(); } catch (e) {}
        try { o.lfo.stop(); } catch (e) {}
      });
      oscillatorsRef.current = null;
    }
  };

  const playAmbient = () => {
    ensureAudioContext();
    stopOscillators();
    const track = TRACKS[trackIndexRef.current];
    oscillatorsRef.current = track.freqs.map((f, i) => {
      const osc = audioCtxRef.current!.createOscillator();
      osc.type = track.type;
      osc.frequency.value = f;

      const g = audioCtxRef.current!.createGain();
      g.gain.value = 0.16 / track.freqs.length;

      osc.connect(g);
      g.connect(masterGainRef.current!);
      osc.start();

      const lfo = audioCtxRef.current!.createOscillator();
      lfo.frequency.value = track.lfo + i * 0.03;
      const lfoGain = audioCtxRef.current!.createGain();
      lfoGain.gain.value = 4;

      lfo.connect(lfoGain);
      lfoGain.connect(osc.detune);
      lfo.start();

      return { osc, lfo, g };
    });

    setMusicState((prev) => ({
      ...prev,
      playing: true,
      playingMode: prev.mode,
      playingTrackIndex: prev.trackIndex,
    }));
    startViz();
    startMusicTimer();
  };

  const pauseAmbient = () => {
    stopOscillators();
    setMusicState((prev) => ({ ...prev, playing: false }));
    stopViz();
    stopMusicTimer();
  };

  const playYouTube = () => {
    setMusicState((prev) => {
      const mode = prev.mode;
      const trackId = mode === "hindi"
        ? HINDI_TRACKS[prev.hindiIndex].id
        : ENGLISH_TRACKS[prev.englishIndex].id;

      ensureYTPlayer().then((p) => {
        try {
          if (p && typeof p.loadVideoById === "function") {
            p.loadVideoById(trackId);
            p.playVideo();
            startMusicTimer();
          } else {
            setTimeout(() => {
              try {
                if (p && typeof p.loadVideoById === "function") {
                  p.loadVideoById(trackId);
                  p.playVideo();
                  startMusicTimer();
                }
              } catch (e) {}
            }, 1000);
          }
        } catch (err) {
          console.error("Player loading error", err);
        }
      }).catch((e) => {
        console.error("Could not load YouTube player promise", e);
        setMusicState((s) => ({ ...s, playing: false }));
      });

      return {
        ...prev,
        playing: true,
        playingMode: mode,
        playingHindiIndex: prev.hindiIndex,
        playingEnglishIndex: prev.englishIndex,
      };
    });
  };

  const pauseYouTube = () => {
    if (ytPlayerRef.current && ytPlayerRef.current.pauseVideo) {
      ytPlayerRef.current.pauseVideo();
    }
    setMusicState((prev) => ({ ...prev, playing: false }));
    stopMusicTimer();
    stopFakeViz();
  };

  const playMusic = () => {
    const mode = musicModeRef.current;
    if (mode === "hindi" || mode === "english") playYouTube();
    else playAmbient();
  };

  const pauseMusic = () => {
    const mode = musicModeRef.current;
    if (mode === "hindi" || mode === "english") pauseYouTube();
    else pauseAmbient();
  };

  const stopAudio = () => {
    stopOscillators();
    stopMusicTimer();
    stopViz();
    stopFakeViz();
    if (ytPlayerRef.current) {
      try {
        if (ytPlayerRef.current.destroy) {
          ytPlayerRef.current.destroy();
        }
      } catch (e) {}
      ytPlayerRef.current = null;
    }
    ytPlayerPromiseRef.current = null; // Clear the player promise so it recreates on next play
  };

  const startMusicTimer = () => {
    clearInterval(musicTimerIntRef.current);
    const fmt = (s: number) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

    const startedTime = Date.now();
    musicTimerIntRef.current = setInterval(() => {
      const mode = musicModeRef.current;
      if ((mode === "hindi" || mode === "english") && ytPlayerRef.current && ytPlayerRef.current.getCurrentTime) {
        const cur = ytPlayerRef.current.getCurrentTime() || 0;
        const dur = ytPlayerRef.current.getDuration() || 0;
        setMusicState((prev) => ({
          ...prev,
          trackTime: dur ? `${fmt(cur)} / ${fmt(dur)}` : fmt(cur),
        }));
      } else {
        const elapsed = (Date.now() - startedTime) / 1000;
        setMusicState((prev) => ({ ...prev, trackTime: fmt(elapsed) }));
      }
    }, 500);
  };

  const stopMusicTimer = () => {
    clearInterval(musicTimerIntRef.current);
  };

  const setMusicVolume = (v: number) => {
    setMusicState((prev) => ({ ...prev, volume: v }));
    const val = v / 100;
    if (masterGainRef.current) masterGainRef.current.gain.value = val;
    if (ytPlayerRef.current && ytPlayerRef.current.setVolume) ytPlayerRef.current.setVolume(v);
  };

  const switchMusicMode = (mode: string) => {
    if (musicModeRef.current === mode) return;
    setMusicState((prev) => ({
      ...prev,
      mode,
    }));
  };

  const nextTrack = () => {
    const isPlaying = musicPlayingRef.current;
    stopAudio();

    setMusicState((prev) => {
      const mode = prev.playingMode;
      let nextHindi = prev.playingHindiIndex;
      let nextEnglish = prev.playingEnglishIndex;
      let nextTrackIdx = prev.playingTrackIndex;

      if (mode === "hindi") {
        nextHindi = (prev.playingHindiIndex + 1) % HINDI_TRACKS.length;
      } else if (mode === "english") {
        nextEnglish = (prev.playingEnglishIndex + 1) % ENGLISH_TRACKS.length;
      } else {
        nextTrackIdx = (prev.playingTrackIndex + 1) % TRACKS.length;
      }

      // Sync browser browsing index if we are on the same mode tab
      const browseHindi = prev.mode === "hindi" ? nextHindi : prev.hindiIndex;
      const browseEnglish = prev.mode === "english" ? nextEnglish : prev.englishIndex;
      const browseTrack = prev.mode === "ambient" ? nextTrackIdx : prev.trackIndex;

      if (isPlaying) {
        setTimeout(() => {
          if (mode === "hindi" || mode === "english") playYouTube();
          else playAmbient();
        }, 100);
      }

      return {
        ...prev,
        playingHindiIndex: nextHindi,
        playingEnglishIndex: nextEnglish,
        playingTrackIndex: nextTrackIdx,
        hindiIndex: browseHindi,
        englishIndex: browseEnglish,
        trackIndex: browseTrack,
        playing: isPlaying
      };
    });
  };

  const prevTrack = () => {
    const isPlaying = musicPlayingRef.current;
    stopAudio();

    setMusicState((prev) => {
      const mode = prev.playingMode;
      let prevHindi = prev.playingHindiIndex;
      let prevEnglish = prev.playingEnglishIndex;
      let prevTrackIdx = prev.playingTrackIndex;

      if (mode === "hindi") {
        prevHindi = (prev.playingHindiIndex - 1 + HINDI_TRACKS.length) % HINDI_TRACKS.length;
      } else if (mode === "english") {
        prevEnglish = (prev.playingEnglishIndex - 1 + ENGLISH_TRACKS.length) % ENGLISH_TRACKS.length;
      } else {
        prevTrackIdx = (prev.playingTrackIndex - 1 + TRACKS.length) % TRACKS.length;
      }

      // Sync browser browsing index if we are on the same mode tab
      const browseHindi = prev.mode === "hindi" ? prevHindi : prev.hindiIndex;
      const browseEnglish = prev.mode === "english" ? prevEnglish : prev.englishIndex;
      const browseTrack = prev.mode === "ambient" ? prevTrackIdx : prev.trackIndex;

      if (isPlaying) {
        setTimeout(() => {
          if (mode === "hindi" || mode === "english") playYouTube();
          else playAmbient();
        }, 100);
      }

      return {
        ...prev,
        playingHindiIndex: prevHindi,
        playingEnglishIndex: prevEnglish,
        playingTrackIndex: prevTrackIdx,
        hindiIndex: browseHindi,
        englishIndex: browseEnglish,
        trackIndex: browseTrack,
        playing: isPlaying
      };
    });
  };

  const startViz = () => {
    if (!analyserRef.current) return;
    const data = new Uint8Array(analyserRef.current.frequencyBinCount);

    const loop = () => {
      if (analyserRef.current) {
        analyserRef.current.getByteFrequencyData(data);
        const newHeights = Array(28).fill(6).map((_, i) => {
          const v = data[i % data.length] || 0;
          return Math.max(6, (v / 255) * 78);
        });
        setVizHeights(newHeights);
        vizRafRef.current = requestAnimationFrame(loop);
      }
    };
    loop();
  };

  const stopViz = () => {
    if (vizRafRef.current) cancelAnimationFrame(vizRafRef.current);
    setVizHeights(Array(28).fill(6));
  };

  const startFakeViz = () => {
    clearInterval(fakeVizIntRef.current);
    fakeVizIntRef.current = setInterval(() => {
      setVizHeights(Array(28).fill(0).map(() => 10 + Math.random() * 72));
    }, 140);
  };

  const stopFakeViz = () => {
    clearInterval(fakeVizIntRef.current);
    setVizHeights(Array(28).fill(6));
  };

  const loadYouTubeAPI = () => {
    return new Promise<void>((resolve, reject) => {
      if (typeof window === "undefined") { reject("No window"); return; }
      if ((window as any).YT && (window as any).YT.Player) { resolve(); return; }

      const prevCb = (window as any).onYouTubeIframeAPIReady;
      (window as any).onYouTubeIframeAPIReady = () => {
        if (prevCb) prevCb();
        resolve();
      };

      if (!document.querySelector('script[src="https://www.youtube.com/iframe_api"]')) {
        const s = document.createElement("script");
        s.src = "https://www.youtube.com/iframe_api";
        s.onerror = () => reject(new Error("Failed to load YT API"));
        document.body.appendChild(s);
      }
    });
  };

  const ensureYTPlayer = () => {
    // Reuse the existing player if it is still alive
    if (ytPlayerPromiseRef.current) {
      if (ytPlayerRef.current && typeof ytPlayerRef.current.getPlayerState === "function") {
        return ytPlayerPromiseRef.current;
      }
      // Player was destroyed — discard stale promise and rebuild
      ytPlayerPromiseRef.current = null;
    }

    ytPlayerPromiseRef.current = loadYouTubeAPI().then(() => new Promise<any>((resolve, reject) => {
      try {
        // Always work with #globalYtPlayerContainer directly — never search by #ytPlayer id,
        // because the YT API replaces/removes that element and leaves it in an unknown state.
        const container = document.getElementById("globalYtPlayerContainer");
        if (!container) {
          reject(new Error("globalYtPlayerContainer not in DOM"));
          return;
        }

        // Wipe any stale iframe/div and give the API a clean fresh target element
        container.innerHTML = "";
        const targetEl = document.createElement("div");
        targetEl.style.width = "100%";
        targetEl.style.height = "100%";
        container.appendChild(targetEl);

        ytPlayerRef.current = new (window as any).YT.Player(targetEl, {
          height: "100%",
          width: "100%",
          videoId: musicModeRef.current === "english"
            ? ENGLISH_TRACKS[englishIndexRef.current].id
            : HINDI_TRACKS[hindiIndexRef.current].id,
          playerVars: { rel: 0, modestbranding: 1, playsinline: 1, autoplay: 1 },
          events: {
            onReady: (e: any) => {
              e.target.setVolume(musicVolumeRef.current * 100);
              resolve(e.target);
            },
            onStateChange: (e: any) => {
              if (e.data === (window as any).YT.PlayerState.PLAYING) startFakeViz();
              else stopFakeViz();
            },
            onError: () => {
              showToast("Video unavailable. Playing synthesizer audio...");
              playAmbient();
            },
          },
        });
      } catch (err) {
        reject(err);
      }
    }));
    return ytPlayerPromiseRef.current;
  };

  const playRPSRound = (playerChoice: "rock" | "paper" | "scissors") => {
    const aiChoice = ["rock", "paper", "scissors"][Math.floor(Math.random() * 3)] as "rock" | "paper" | "scissors";
    const beats = { rock: "scissors", paper: "rock", scissors: "paper" };
    const labels = { rock: "Rock ✊", paper: "Paper ✋", scissors: "Scissors ✌" };

    let resultMsg = "";
    let win = 0, loss = 0, tie = 0;

    if (playerChoice === aiChoice) {
      tie = 1;
      resultMsg = `Tie — both played ${playerChoice}.`;
    } else if (beats[playerChoice] === aiChoice) {
      win = 1;
      resultMsg = `You win! ${playerChoice} beats ${aiChoice}.`;
    } else {
      loss = 1;
      resultMsg = `JARVIS wins. ${aiChoice} beats ${playerChoice}.`;
    }

    setRpsState((prev) => ({
      ...prev,
      wins: prev.wins + win,
      losses: prev.losses + loss,
      ties: prev.ties + tie,
      playerChoice: labels[playerChoice],
      aiChoice: labels[aiChoice],
      result: resultMsg,
      playingRound: false,
    }));
  };

  const gestureToRPS = () => {
    const g = (gestureEngine.lastGesture || "").toLowerCase();
    if (g.includes("fist")) return "rock";
    if (g.includes("open palm") || g.includes("paper")) return "paper";
    if (g.includes("peace") || g.includes("scissors")) return "scissors";
    return null;
  };

  const runRPSGestureRound = () => {
    setRpsState((prev) => ({
      ...prev,
      playingRound: true,
      countdown: 3,
      result: settings.gesture ? "Show Rock, Paper, or Scissors to the camera..." : "Tip: turn on the gesture camera in Settings!",
    }));

    let count: number | string = 3;
    const interval = setInterval(() => {
      if (typeof count === "number") {
        count--;
        if (count > 0) {
          setRpsState((prev) => ({ ...prev, countdown: count }));
        } else if (count === 0) {
          count = "GO!";
          setRpsState((prev) => ({ ...prev, countdown: count }));
        }
      } else {
        clearInterval(interval);
        setRpsState((prev) => ({ ...prev, countdown: null }));

        const move = gestureToRPS();
        if (!move) {
          setRpsState((prev) => ({
            ...prev,
            result: "No gesture seen — tap Rock, Paper, or Scissors below!",
            playingRound: false,
          }));
          return;
        }
        playRPSRound(move);
      }
    }, 700);
  };

  const parseCommand = (rawText: string, source: string) => {
    const text = (rawText || "").trim();
    if (!text) return;
    logCommand(source, text);
    const t = text.toLowerCase();

    if (/\b(open\s+)?(air\s+)?draw(ing)?\b/.test(t)) {
      router.push("/draw");
      speak("Opening air drawing.");
      return;
    }
    if (/\bplay\b/.test(t)) {
      const songIdx = HINDI_TRACKS.findIndex((song) => t.includes(song.name.toLowerCase()));
      if (songIdx > -1) {
        router.push("/music");
        setMusicState((prev) => ({
          ...prev,
          mode: "hindi",
          hindiIndex: songIdx,
          playing: true,
        }));
        speak("Playing " + HINDI_TRACKS[songIdx].name + ".");
        setTimeout(() => playYouTube(), 200);
        return;
      }
    }
    if (/\bmusic\b/.test(t)) {
      router.push("/music");
      if (/hindi|bollywood/.test(t)) {
        setMusicState((prev) => ({ ...prev, mode: "hindi" }));
      }
      if (/\bplay\b/.test(t)) {
        setTimeout(() => playMusic(), 200);
        speak("Playing music.");
      } else if (/\b(pause|stop)\b/.test(t)) {
        setTimeout(() => pauseMusic(), 200);
        speak("Music paused.");
      } else {
        speak("Opening music control.");
      }
      return;
    }
    if (/\bweather\b/.test(t)) {
      router.push("/weather");
      const m = t.match(/weather (?:in|for|at)\s+([a-z\s]+?)(?:\?|$|\btoday\b|\bnow\b)/);
      if (m && m[1] && m[1].trim()) {
        const targetCity = m[1].trim();
        setWeatherState((prev) => ({ ...prev, cityInput: targetCity }));
        searchWeather(targetCity, true);
      } else if (weatherStateRef.current.weatherLastCity) {
        searchWeather(weatherStateRef.current.weatherLastCity, true);
      } else {
        useMyLocationWeather(true);
      }
      return;
    }
    if (/\bcalculator\b|\bcalc\b/.test(t)) {
      router.push("/calc");
      speak("Opening calculator.");
      return;
    }
    if (/\b(dashboard|home)\b/.test(t)) {
      router.push("/");
      speak("Back to the dashboard.");
      return;
    }
    if (/\bnotes?\b/.test(t)) {
      router.push("/notes");
      speak("Opening notes.");
      return;
    }
     if (/\bgames?\b|rock\s*paper\s*scissors|hill\s*climb|start\s*game|pause\s*game|resume\s*game|restart\s*game|exit\s*game/.test(t)) {
       router.push("/games");
       speak("Opening games page.");

       // Global voice commands dispatched to the game viewport
       if (/\bstart\s*game\b/.test(t)) {
         setTimeout(() => {
           window.dispatchEvent(new CustomEvent("jarvis-game-control", { detail: { action: "start" } }));
         }, 800);
       } else if (/\bpause\s*game\b/.test(t)) {
         setTimeout(() => {
           window.dispatchEvent(new CustomEvent("jarvis-game-control", { detail: { action: "pause" } }));
         }, 800);
       } else if (/\bresume\s*game\b/.test(t)) {
         setTimeout(() => {
           window.dispatchEvent(new CustomEvent("jarvis-game-control", { detail: { action: "resume" } }));
         }, 800);
       } else if (/\brestart\s*game\b/.test(t)) {
         setTimeout(() => {
           window.dispatchEvent(new CustomEvent("jarvis-game-control", { detail: { action: "restart" } }));
         }, 800);
       } else if (/\bexit\s*game\b/.test(t)) {
         setTimeout(() => {
           window.dispatchEvent(new CustomEvent("jarvis-game-control", { detail: { action: "exit" } }));
         }, 800);
       } else {
         speak("Let's play.");
       }
       return;
     }
     
     if (pathnameRef.current === "/games") {
       if (/\bstart\s*game\b/.test(t)) {
         window.dispatchEvent(new CustomEvent("jarvis-game-control", { detail: { action: "start" } }));
         return;
       }
       if (/\bpause\s*game\b/.test(t)) {
         window.dispatchEvent(new CustomEvent("jarvis-game-control", { detail: { action: "pause" } }));
         return;
       }
       if (/\bresume\s*game\b/.test(t)) {
         window.dispatchEvent(new CustomEvent("jarvis-game-control", { detail: { action: "resume" } }));
         return;
       }
       if (/\brestart\s*game\b/.test(t)) {
         window.dispatchEvent(new CustomEvent("jarvis-game-control", { detail: { action: "restart" } }));
         return;
       }
       if (/\bexit\s*game\b/.test(t)) {
         window.dispatchEvent(new CustomEvent("jarvis-game-control", { detail: { action: "exit" } }));
         return;
       }
     }
    if (/\bsettings?\b/.test(t)) {
      router.push("/settings");
      speak("Opening settings.");
      return;
    }
    // We add the user's message to the chat history and respond, 
    // but we do NOT automatically open the chat panel (setChatOpen(true)) 
    // so the conversation can happen seamlessly in the background.
    setChatHistory((prev) => [...prev, { role: "user", content: rawText }]);
    respondAsAI(rawText);
  };

  const getRecognition = () => {
    if (recognitionRef.current) return recognitionRef.current;
    if (typeof window === "undefined") return null;

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      showToast("Speech recognition not supported in this browser");
      return null;
    }
    const r = new SpeechRecognition();
    r.lang = "en-US";
    r.interimResults = true;

    r.onresult = (e: any) => {
      let interim = "", final = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const trans = e.results[i][0].transcript;
        if (e.results[i].isFinal) final += trans;
        else interim += trans;
      }

      setVoiceState((prev) => ({ ...prev, interimTranscript: interim }));

      if (!final) return;
      final = final.trim();
      if (!final) return;

      const mode = voiceStateRef.current.mode;
      if (mode === "dictate-chat") {
        sendChatMessage(final);
        stopListening();
      } else if (mode === "dictate-note") {
        window.dispatchEvent(new CustomEvent("voice-note-dictation", { detail: final }));
        stopListening();
      } else {
        parseCommand(final, "VOICE");
        if (!settings.continuous) {
          stopListening();
        }
      }
      setVoiceState((prev) => ({ ...prev, interimTranscript: "" }));
    };

    r.onerror = (e: any) => {
      if (e.error === "not-allowed" || e.error === "service-not-allowed") {
        showToast("Microphone permission denied");
      }
      setVoiceState((prev) => ({ ...prev, listening: false, interimTranscript: "" }));
    };

    r.onend = () => {
      const mode = voiceStateRef.current.mode;
      const listening = voiceStateRef.current.listening;
      if (mode === "command" && settings.continuous && listening) {
        try { r.start(); } catch (err) {}
      } else {
        setVoiceState((prev) => ({ ...prev, listening: false }));
      }
    };

    recognitionRef.current = r;
    return r;
  };

  const startListening = (mode = "command") => {
    const r = getRecognition();
    if (!r) return;

    setVoiceState((prev) => ({
      ...prev,
      listening: true,
      mode,
      captionVisible: mode === "command",
    }));

    r.continuous = mode === "command" ? settings.continuous : false;
    try {
      r.start();
    } catch (e) {
      console.warn(e);
    }
  };

  const stopListening = () => {
    const r = recognitionRef.current;
    if (r) {
      try { r.stop(); } catch (e) {}
    }
    setVoiceState((prev) => ({
      ...prev,
      listening: false,
      captionVisible: false,
      interimTranscript: "",
    }));
  };

  const toggleCommandMic = () => {
    if (voiceState.listening && voiceState.mode === "command") {
      stopListening();
    } else {
      startListening("command");
    }
  };


  // ── Gesture Engine ──────────────────────────────────────────────────────
  const gestureEngine = useGestureEngine(
    settings.sensitivity,
    pathname,
    showToast,
    nextTrack,
    prevTrack,
    setChatOpen,
  );

  const [lastGesture, setLastGesture] = useState<string | null>(null);
  useEffect(() => {
    setLastGesture(gestureEngine.lastGesture);
  }, [gestureEngine.lastGesture]);

  const value: AppContextType = {
    booting,
    onboardingOpen,
    setOnboardingOpen,
    currentTime,
    currentDate,
    uptimeStr,
    getGreeting,
    toasts,
    showToast,
    activeView: pathname === "/" ? "home" : pathname.replace("/", ""),
    navigate: (view) => router.push(view === "home" ? "/" : "/" + view),
    stats,
    setStats,
    cmdLogEntries,
    logCommand,
    parseCommand,
    notes,
    addNote,
    updateNote,
    deleteNote,
    chatHistory,
    isTyping,
    sendChatMessage,
    clearChat,
    settings,
    setSettings,
    musicState,
    setMusicState,
    vizHeights,
    playMusic,
    pauseMusic,
    nextTrack,
    prevTrack,
    setMusicVolume,
    switchMusicMode,
    rpsState,
    setRpsState,
    playRPSRound,
    runRPSGestureRound,
    weatherState,
    setWeatherState,
    searchWeather,
    useMyLocationWeather,
    voiceState,
    startListening,
    stopListening,
    toggleCommandMic,
    speak,
    gestureHUDMinimized,
    setGestureHUDMinimized,
    gestureLabel: gestureEngine.gestureLabel,
    gestureCursor: gestureEngine.gestureCursor,
    ripples: gestureEngine.ripples,
    gestureConfidencePct: gestureEngine.gestureConfidencePct,
    recentGestures: gestureEngine.recentGestures,
    enableGestureCamera: gestureEngine.enableGestureCamera,
    disableGestureCamera: gestureEngine.disableGestureCamera,
    stopCameraOnly: gestureEngine.stopCameraOnly,
    lastGesture,
    chatOpen,
    setChatOpen,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within AppContextProvider");
  }
  return context;
}
