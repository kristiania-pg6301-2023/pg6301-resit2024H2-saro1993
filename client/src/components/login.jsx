
export function Login() {
    async function handleStartLogin() {
      const { authorization_endpoint } = await fetchJson(
        "https://accounts.google.com/.well-known/openid-configuration"
      );
      const REACT_APP_CLIENT_ID = process.env.REACT_APP_CLIENT_ID;
      const query = new URLSearchParams({
        response_type: "token",
        scope: "openid profile email",
        REACT_APP_CLIENT_ID: "your-client-id",
        redirect_uri: window.location.origin + "/callback",
      });
      window.location.href = authorization_endpoint + "?" + query;
    }
  
    return <button onClick={handleStartLogin}>Log in</button>;
  }
  