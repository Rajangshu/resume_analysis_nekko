// src/App.js
import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";

import DashboardPage from "./pages/DashboardPage";
import UploadAnalysisPage from "./pages/UploadAnalysisPage";
import ChatPage from "./pages/ChatPage";
import InterviewPage from "./pages/InterviewPage";
import HrQuestionnairePage from "./pages/HrQuestionnairePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

import Navbar from "./components/Navbar";
import { AuthProvider } from "./auth/AuthContext";
import PrivateRoute from "./auth/PrivateRoute";

const App = () => {
  const location = useLocation();
  const isPublic = ["/login", "/register"].includes(location.pathname);

  return (
    <AuthProvider>
      {!isPublic && <Navbar />}
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* ✅ Protected Routes */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <DashboardPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <DashboardPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/analyze"
          element={
            <PrivateRoute>
              <UploadAnalysisPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/chat"
          element={
            <PrivateRoute>
              <ChatPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/interview"
          element={
            <PrivateRoute>
              <InterviewPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/hr-questionnaire"
          element={
            <PrivateRoute>
              <HrQuestionnairePage />
            </PrivateRoute>
          }
        />
      </Routes>
    </AuthProvider>
  );
};

export default App;
