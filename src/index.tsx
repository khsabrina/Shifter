import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./Components/LoginArea/Login/Login";
import Home from "./Components/Pages/Home/Home"
import Calendar from "./Components/Pages/Calendar/Calendar"
import Prioritizer from "./Components/Pages/Prioritizer/Prioritizer"
import Team from "./Components/Pages/Team/Team"
import Settings from "./Components/Pages/Settings/Settings"
import "./index.css";
import { useEffect } from "react";
import auth from "./Components/auth/auth";

export default function App() {
  useEffect(() => {
    function handleBeforeUnload() {
      auth.logout();
    }

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        {/* <Route path="/home" element={<Home />} /> */}
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/prioritizer" element={<Prioritizer />} />
        <Route path="/team" element={<Team />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(<App />);