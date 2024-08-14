import React from "react";

function LoginButton() {
  async function handleLogin() {
    try {
      const response = await fetch(
        "https://accounts.google.com/.well-known/openid-configuration"
      );
      if (!response.ok) {
        throw new Error("Failed to fetch OpenID configuration.");
      }
      const { authorization_endpoint } = await response.json();
      const query = new URLSearchParams({
        response_type: "token",
        scope: "openid profile email",
        client_id: process.env.REACT_APP_CLIENT_ID,
        redirect_uri: `${window.location.origin}/callback`,
      });
      window.location.href = `${authorization_endpoint}?${query.toString()}`;
    } catch (error) {
      console.error("Error during login process:", error);
      alert("Could not start login process. Please try again later.");
    }
  }

  return <button onClick={handleLogin}>Logg inn med Google</button>;
}

export default LoginButton;
