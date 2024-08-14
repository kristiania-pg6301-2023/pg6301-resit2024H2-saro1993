import React from "react";

function LoginButton() {
  return (
    <button onClick={() => (window.location.href = "/auth/google")}>
      Logg inn med Google
    </button>
  );
}

export default LoginButton;
