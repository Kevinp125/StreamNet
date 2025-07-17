import "./App.css";
import {Routes, Route } from "react-router-dom"
import LandingPage from "./pages/LandingPage/LandingPage";
import DashboardPage from "./pages/DashboardPage/DashboardPage";
import DiscoverPage from "./pages/DiscoverPage/DiscoverPage";
import SavedConnectionsPage from "./pages/SavedConnectionsPage/SavedConnectionsPage";
import EventsPage from "./pages/EventsPage/EventsPage";
import CheckIfNewProfilePage from "./pages/CheckIfNewProfilePage/CheckIfNewProfilePage";
import Layout from "./components/Layout/Layout";
import { AuthProvider } from "./Context/AuthProvider";
import { WebSocketProvider } from "./Context/WebSocketProvider";
import { Toaster } from "sonner";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import { DASHBOARD_PATH, LANDING_PATH, EXTRA_SETUP_PATH, DISCOVER_PATH, CONNECTIONS_PATH, EVENTS_PATH} from "@/lib/paths";

function App() {
  return (
    <>
      <AuthProvider> {/*Allows all components to have the session and user context */}
        <WebSocketProvider>
          <Routes>

            <Route path={LANDING_PATH} element={<LandingPage />} /> {/*This is only unprotected route since it is the landing page */}
            
            <Route path={DASHBOARD_PATH} element={<ProtectedRoute> <DashboardPage /> </ProtectedRoute>} />
            <Route path={EXTRA_SETUP_PATH} element={<ProtectedRoute> <CheckIfNewProfilePage /> </ProtectedRoute>} />

            <Route element = {<Layout/>}> {/*Below pages are wrapped in layout element cause they have navbar */}
              <Route path={DISCOVER_PATH} element={<ProtectedRoute> <DiscoverPage /> </ProtectedRoute>} />
              <Route path={CONNECTIONS_PATH} element={<ProtectedRoute> <SavedConnectionsPage /> </ProtectedRoute>} />
              <Route path={EVENTS_PATH} element={<ProtectedRoute> <EventsPage /> </ProtectedRoute>} />
            </Route>

          </Routes>  

          <Toaster/>
        </WebSocketProvider>
      </AuthProvider>
    </>
  );
}

export default App;
