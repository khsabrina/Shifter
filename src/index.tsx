import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./Components/LoginArea/Login/Login";
// import Home from "./Components/Pages/Home/Home"
import Calendar from "./Components/Pages/Calendar/Calendar"
// import Prioritizer from "./Components/Pages/Prioritizer/Prioritizer"
import Team from "./Components/Pages/Team/Team"
import Settings from "./Components/Pages/Settings/Settings"
import "./index.css";
import { useEffect } from "react";
import auth from "./Components/auth/auth";
import Prioritizer from "./Components/Pages/Prioritizer/Prioritizer";
import Priouser from "./Components/Pages/Priouser/Priouser";

export default function App() {
  const isAdmin = localStorage.getItem("isAdmin") === "true"; // Correctly read the isAdmin value

  useEffect(() => {
    function handleBeforeUnload() {
      // auth.logout();
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

        {/* Barak */}
        {/* /* */}
        {/* /* */}
        {/* /* */}
        {/* /* */}
        {/* /* */}
        {/* /* */}
        תעשה חיפוש אלה שמה היא מבדילה מה להציג לפי מנהלPrioritizerWrapper
        <Route path="/prioritizer" element={<PrioritizerWrapper />} />
        {/* /* */}
        {/* /* */}
        {/* /* */}
        {/* /* */}
        {/* /* */}
        {/* /* */}
        {/* /* */}
        {/* <Route path="/priouser" element={<Priouser />} /> */}
        <Route path="/team" element={<Team />} />
        {/* <Route path="/settings" element={<Settings />} /> */}
        <Route path="/" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}
function PrioritizerWrapper() {
  const isAdmin = localStorage.getItem("isAdmin") === "true";

  return isAdmin ? <Prioritizer /> : <Priouser />;
}
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(<App />);