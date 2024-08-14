import React, { useState, useEffect, useContext } from "react";
import { fetchJSON } from "../api/fetchJSON";
import "./HomePage.css";
import LoginButton from "../components/LoginButton";
import { UserContext } from "../context/UserContext";

const HomePage = () => {
  const { user, setUser } = useContext(UserContext);
  const [articles, setArticles] = useState([]);
  const [error, setError] = useState();

  useEffect(() => {
    // Hent brukerinformasjon når HomePage lastes inn
    const token = sessionStorage.getItem("access_token");
    if (token && !user) {
      fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => response.json())
        .then((data) => setUser(data))
        .catch(() => {
          setUser(null);
        });
    }

    async function getArticles() {
      try {
        const articles = await fetchJSON("/api/articles");
        setArticles(articles);
      } catch (error) {
        setError(error.message);
      }
    }
    getArticles();
  }, [user, setUser]);

  return (
    <div className="homepage-container">
      {!user ? (
        <LoginButton />
      ) : (
        <div>
          <h1>Welcome, {user.name}!</h1>
          <button onClick={() => (window.location.href = "/auth/logout")}>
            Log out
          </button>
          
        </div>
      )}

      <h1 className="homepage-title">News Articles</h1>
      {error && <div className="error-message">Error: {error}</div>}
      <ul className="article-list">
        {articles.map((article) => (
          <li key={article._id} className="article-item">
            <a href={`/article/${article._id}`} className="article-link">
              {article.title}
            </a>
            <p className="article-description">
              {article.content.slice(0, 100)}...
            </p>
            {article.image && (
              <img
                src={article.image}
                alt={article.title}
                className="article-image"
              />
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HomePage;
