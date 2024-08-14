export function Login() {
    async function handleStartLogin() {
      const { authorization_endpoint } = await fetchJson(
        "https://accounts.google.com/.well-known/openid-configuration"
      );
      const query = new URLSearchParams({
        response_type: "token",
        scope: "openid profile email",
        client_id: "your-client-id",
        redirect_uri: window.location.origin + "/callback",
      });
      window.location.href = authorization_endpoint + "?" + query;
    }
  
    return <button onClick={handleStartLogin}>Log in</button>;
  }
  