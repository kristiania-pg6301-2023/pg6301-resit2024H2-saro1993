import React from "react";
import { useHistory } from "react-router-dom";

export function LogoutButton() {
  const history = useHistory();

  const handleLogout = () => {
    sessionStorage.removeItem("access_token");
    history.push("/"); 
  };

  return <button onClick={handleLogout}>Logg ut</button>;
}
