import "./App.css";
import {Routes, Route } from "react-router-dom";
import LandingPage from "./components/pages/LandingPage/LandingPage";
import DashboardPage from "./components/pages/DashboardPage/DashboardPage";
import DiscoverPage from "./components/pages/DiscoverPage/DiscoverPage";
import SavedConnectionsPage from "./components/pages/SavedConnectionsPage/SavedConnectionsPage";
import EventsPage from "./components/pages/EventsPage/EventsPage";
import InitialRegisterSetupPage from "./components/pages/InitialRegisterSetupPage/InitialRegisterSetupPage";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/discover" element={<DiscoverPage />} />
        <Route path="/connections" element={<SavedConnectionsPage />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/extra-setup" element={<InitialRegisterSetupPage />} />
      </Routes>
    </>
  );
}

export default App;
