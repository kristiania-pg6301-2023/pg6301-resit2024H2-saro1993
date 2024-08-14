import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function LoginCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/profile");
  }, [navigate]);

  return <div>Logging in...</div>;
}

export default LoginCallback;
