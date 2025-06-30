import "./App.css";
import {Routes, Route } from "react-router-dom";
import LandingPage from "./components/pages/LandingPage/LandingPage";
import DashboardPage from "./components/pages/DashboardPage/DashboardPage";
import DiscoverPage from "./components/pages/DiscoverPage/DiscoverPage";
import SavedConnectionsPage from "./components/pages/SavedConnectionsPage/SavedConnectionsPage";
import EventsPage from "./components/pages/EventsPage/EventsPage";
import CheckIfNewProfilePage from "./components/pages/InitialRegisterSetupPage/CheckIfNewProfilePage";
import Layout from "./components/Layout/Layout";
import { AuthProvider } from "./Context/AuthProvider";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";

function App() {
  return (
    <>
      <AuthProvider> {/*Allows all components to have the session and user context */}
        <Routes>

          <Route path="/" element={<LandingPage />} /> {/*This is only unprotected route since it is the landing page */}
          
          <Route path="/dashboard" element={<ProtectedRoute> <DashboardPage /> </ProtectedRoute>} />
          <Route path="/extra-setup" element={<ProtectedRoute> <CheckIfNewProfilePage /> </ProtectedRoute>} />

          <Route element = {<Layout/>}> {/*Below pages are wrapped in layout element cause they have navbar */}
            <Route path="/discover" element={<ProtectedRoute> <DiscoverPage /> </ProtectedRoute>} />
            <Route path="/connections" element={<ProtectedRoute> <SavedConnectionsPage /> </ProtectedRoute>} />
            <Route path="/events" element={<ProtectedRoute> <EventsPage /> </ProtectedRoute>} />
          </Route>

        </Routes>  
      </AuthProvider>
    </>
  );
}

export default App;
