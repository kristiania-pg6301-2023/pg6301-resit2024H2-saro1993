import React from "react";
import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ProfilePage from "./pages/ProfilePage";
import LoginButton from "./components/LoginButton";
import LoginCallback from "./components/LoginCallback";
import ArticleDetail from "./pages/ArticleDetail";
import { UserProvider } from "./context/UserContext";

function App() {
  return (
    <UserProvider>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/article/:id" element={<ArticleDetail />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/login" element={<LoginButton />} />
        <Route path="/callback" element={<LoginCallback />} />
      </Routes>
    </UserProvider>
  );
}

export default App;
