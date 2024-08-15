import React, { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";

function LoginCallback() {
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);

  useEffect(() => {
    async function handleCallback() {
      const query = new URLSearchParams(window.location.hash.substring(1));
      const token = query.get("access_token");

      if (token) {
        try {
          localStorage.setItem("access_token", token);

          const response = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (response.ok) {
            const user = await response.json();
            setUser(user);
            navigate("/home");
          } else {
            console.error("Failed to fetch user data");
          }
        } catch (error) {
          console.error("Failed to log in", error);
        }
      } else {
        console.error("No access token found");
      }
    }
    handleCallback();
  }, [navigate, setUser]);

  return <div>Logging in...</div>;
}
export default LoginCallback;
