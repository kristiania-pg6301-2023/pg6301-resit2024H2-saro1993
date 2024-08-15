import React from "react";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../context/UserContext";

function LogoutButton() {
  const navigate = useNavigate();
  const { setUser } = useUserContext();

  const handleLogout = () => {
    sessionStorage.removeItem("access_token");
    setUser(null);
    navigate("/");
  };

  return <button onClick={handleLogout}>Logg ut</button>;
}
export default LogoutButton;
