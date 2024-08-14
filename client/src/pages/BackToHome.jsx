import React from "react";
import { useNavigate } from "react-router-dom";

function BackToHomeButton() {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate("/home");
  };

  return <button onClick={handleBack}>Back to Home</button>;
}

export default BackToHomeButton;
