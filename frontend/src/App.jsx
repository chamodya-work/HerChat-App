import React from "react";
import { Route, Routes } from "react-router";
import HomePage from "./pages/HomePage.jsx";
import LoginPage from "./pages/LoginPage";
import NotificationPage from "./pages/NotificationPage";
import CallPage from "./pages/CallPage";
import ChatPage from "./pages/ChatPage";
import OnboardingPage from "./pages/OnboardingPage";

const App = () => {
  return (
    <div className="h-screen">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signup" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/notification" element={<NotificationPage />} />
        <Route path="/call" element={<CallPage />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/onboarding" element={<OnboardingPage />} />
      </Routes>
    </div>
  );
};

export default App;
