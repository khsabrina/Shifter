import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./Components/LayoutArea/Layout/Layout";
import Login from "./Components/LoginArea/Login/Login";
import Home from "./Components/Pages/Home/Home"
import Calendar from "./Components/Pages/Calendar/Calendar"
import Prioritizer from "./Components/Pages/Prioritizer/Prioritizer"
import Team from "./Components/Pages/Team/Team"
import Settings from "./Components/Pages/Settings/Settings"
import "./index.css";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/prioritizer" element={<Prioritizer />} />
        <Route path="/team" element={<Team />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </BrowserRouter>
  );
}

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(<App />);