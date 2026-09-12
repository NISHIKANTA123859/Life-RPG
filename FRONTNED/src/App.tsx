import { useState } from "react";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";

export type Page =
  | "landing"
  | "login"
  | "register"
  | "dashboard"
  | "quests"
  | "character"
  | "skills"
  | "ai-intel"
  | "achievements"
  | "shop"
  | "inventory"
  | "activity"
  | "leaderboard"
  | "profile"
  | "settings";

export default function App() {
  const [page, setPage] = useState<Page>("landing");

  if (page === "landing") {
    return (
      <Landing
        onEnter={() => setPage("dashboard")}
        onLogin={() => setPage("login")}
      />
    );
  }
  if (page === "login") {
    return <Login onLogin={() => setPage("dashboard")} onRegister={() => setPage("register")} />;
  }
  if (page === "register") {
    return <Register onDone={() => setPage("dashboard")} onLogin={() => setPage("login")} />;
  }

  return <Dashboard currentPage={page} onNavigate={setPage} />;
}
