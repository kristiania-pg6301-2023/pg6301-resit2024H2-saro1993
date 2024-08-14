import React, { useState } from "react";

export function Login() {
  const [error, setError] = useState(null);

  async function handleStartLogin() {
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
        client_id: process.env.REACT_APP_CLIENT_ID, // Bruk miljøvariabel for client_id
        redirect_uri: `${window.location.origin}/callback`, // Bruk korrekt redirect_uri
      });

      window.location.href = `${authorization_endpoint}?${query.toString()}`;
    } catch (error) {
      console.error("Error during login process:", error);
      setError("There was an issue starting the login process. Please try again later.");
    }
  }

  return (
    <div>
      <button onClick={handleStartLogin}>Log in with Google</button>
      {error && <div className="error-message">{error}</div>}
    </div>
  );
}
