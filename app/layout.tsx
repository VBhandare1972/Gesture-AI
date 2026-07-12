import "./globals.css";
import { AppContextProvider } from "@/context/AppContext";
import { AuthProvider } from "@/context/AuthContext";
import LayoutContent from "@/components/LayoutContent";

export const metadata = {
  title: "GESTURE.AI — Holographic Assistant",
  description: "GESTURE.AI is a self-contained holographic dashboard — voice via Web Speech API, hand tracking via on-device MediaPipe Hands, weather via Open-Meteo.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
      </head>
      <body suppressHydrationWarning>
        <AuthProvider>
          <AppContextProvider>
            <LayoutContent>{children}</LayoutContent>
          </AppContextProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
