import { Route, Routes, Navigate } from "react-router";

import HomePage from "./pages/HomePage";
import CreatePage from "./pages/CreatePage";
import NoteDetailPage from "./pages/NoteDetailPage";
import LoginPage from "./pages/LoginPage";
import PageNotFound from "./pages/PageNotFound";

import { GoogleOAuthProvider } from "@react-oauth/google";
import { isAuthenticated } from "./lib/auth";

const ProtectedRoute = ({ children }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

const GuestRoute = ({ children }) => {
  if (isAuthenticated()) {
    return <Navigate to="/" replace />;
  }

  return children;
};

const App = () => {
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || import.meta.env.VITE_CLIENT_ID;

  if (!googleClientId) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-base-200">
        <div className="card max-w-lg w-full bg-base-100 shadow-xl border border-base-content/10">
          <div className="card-body">
            <h2 className="card-title">Missing Google OAuth Client ID</h2>
            <p>
              Set <strong>VITE_GOOGLE_CLIENT_ID</strong> in frontend/.env and restart the frontend
              server.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <div className="relative h-full w-full">
        <div className="absolute inset-0 -z-10 h-full w-full items-center px-5 py-24 [background:radial-gradient(125%_125%_at_50%_10%,#000_60%,#00FF9D40_100%)]" />
        <Routes>
          <Route
            path="/login"
            element={
              <GuestRoute>
                <LoginPage />
              </GuestRoute>
            }
          />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/create"
            element={
              <ProtectedRoute>
                <CreatePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/note/:id"
            element={
              <ProtectedRoute>
                <NoteDetailPage />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </div>
    </GoogleOAuthProvider>
  );
};
export default App;
