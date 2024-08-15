export function CompleteLoginPage({onComplete}) {
    const hash = Object.fromEntries(
      new URLSearchParams(window.location.hash.substr(1))
    );
    const { access_token, error } = hash;
    useEffect(() => {
      if (access_token) {
        onComplete({ access_token });
      }
    }, [access_token]);
  
    if (error) {
      return <div>Error logging in...</div>;
    }
   
    return <div>Completing login...</div>;
  }
  