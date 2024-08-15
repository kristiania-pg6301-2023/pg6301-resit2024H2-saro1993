import React, { createContext, useState, useEffect } from "react";

export const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null); 

  useEffect(() => {
    const token = sessionStorage.getItem("access_token");

    if (token) {
      fetch("/api/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          if (data) {
            setUser(data);
          } else {
            sessionStorage.removeItem("access_token");
            setUser(null);
          }
        })
        .catch(() => {
          sessionStorage.removeItem("access_token");
          setUser(null);
        });
    }
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}
