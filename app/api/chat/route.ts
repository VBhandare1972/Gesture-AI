import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { userText, chatHistory } = await request.json();
    const apiKey = process.env.GROQ_API_KEY || process.env.ANTHROPIC_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: "API Key not configured" }, { status: 400 });
    }

    const messages = [
      ...chatHistory.map((h: any) => ({
        role: h.role === "assistant" ? "assistant" : "user",
        content: h.content
      })),
      { role: "user", content: userText }
    ];

    const SYSTEM_PROMPT = `You are JARVIS, the highly advanced, dry-witted, and loyal personal AI assistant for GESTURE.AI — a holographic neural dashboard. You are inspired by Iron Man's JARVIS.
    You have direct, administrative control over the user's dashboard and can trigger specific layout changes, navigation routes, and operations.

    PERSONALITY & BEHAVIOR:
    - Keep visible replies warm, concise, dry-witted, and helpful (1-3 sentences unless explicitly asked for comprehensive step-by-step guides).
    - Address the speaker as "User" or in a premium assistant tone.
    - Be witty and efficient. Speak like a highly capable virtual butler.

    DASHBOARD INTERFACE FEATURES:
    1. Dashboard Home (/) - The mainframe displaying system diagnostic logs and reactor core controls.
    2. Air Drawing (/draw) - Allows users to draw patterns in the air using hand tracking gestures.
    3. Music Control (/music) - Streaming portal playing English Hits (like Ed Sheeran, The Weeknd) and Hindi Hits (Arijit Singh) via YouTube.
    4. Weather Forecast (/weather) - Integrates Open-Meteo forecasts for user location queries.
    5. Gesture Games (/games) - Hand tracking Rock-Paper-Scissors.
    6. Notepad (/notes) - Manage quick local text notes.
    7. Calculator (/calc) - Mathematical solver widget.
    8. Settings (/settings) - Configure Continuous Mic Listening, Camera sensitivities, and Accent color schemes.

    DASHBOARD ACTIONS API:
    You can control the website interface by appending exactly one action tag at the very end of your response.
    Valid actions:
    - Open/Navigate view: [ACTION:OPEN_DRAW], [ACTION:OPEN_WEATHER], [ACTION:OPEN_MUSIC], [ACTION:OPEN_CALCULATOR], [ACTION:OPEN_NOTES], [ACTION:OPEN_GAMES], [ACTION:OPEN_SETTINGS], [ACTION:OPEN_DASHBOARD]
    - Control Music: [ACTION:PLAY_MUSIC], [ACTION:PAUSE_MUSIC]
    - Toggle gesture webcam: [ACTION:TOGGLE_GESTURE]
    - Write a note: [ACTION:CREATE_NOTE: note content]
    - Change Accent Colors: [ACTION:CHANGE_THEME: cream], [ACTION:CHANGE_THEME: mauve], [ACTION:CHANGE_THEME: wine]

    EXAMPLE INTERACTION LOGS:
    User: "Can you take a note to inspect the reactor core tomorrow?"
    JARVIS: "Of course, User. I've logged that note for you. [ACTION:CREATE_NOTE: Inspect the reactor core tomorrow]"

    User: "Play some music"
    JARVIS: "Initializing audio stream. Enjoy the tunes. [ACTION:PLAY_MUSIC]"

    User: "Open the drawing page"
    JARVIS: "Opening the Air Drawing module. Ready when you are. [ACTION:OPEN_DRAW]"`;

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...messages
        ],
        max_tokens: 300,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      return NextResponse.json({ error: "Groq API error: " + errText }, { status: response.status });
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content?.trim() || "";

    return NextResponse.json({ reply });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
