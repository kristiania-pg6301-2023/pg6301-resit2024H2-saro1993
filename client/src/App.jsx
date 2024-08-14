import React from "react";
import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ProfilePage from "./pages/ProfilePage";
import LoginButton from "./components/LoginButton";
import LoginCallback from "./components/Logincallback";
import ArticleDetail from "./pages/ArticleDetail";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/article/:id" element={<ArticleDetail />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/login" element={<LoginButton />} />
      <Route path="/auth/google/callback" element={<LoginCallback />} />
    </Routes>
  );
}

export default App;
