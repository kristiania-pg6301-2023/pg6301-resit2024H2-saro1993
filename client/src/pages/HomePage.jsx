import React, { useState, useEffect, useContext } from "react";
import { fetchJSON } from "../api/fetchJSON";
import "./HomePage.css";
import LoginButton from "../components/LoginButton";
import { UserContext } from "../context/UserContext";
import ArticleForm from "./ArticleForm";

const HomePage = () => {
  const { user } = useContext(UserContext); 
  const [articles, setArticles] = useState([]);
  const [error, setError] = useState();

  useEffect(() => {
    async function getArticles() {
      try {
        const articles = await fetchJSON("/api/articles");
        setArticles(articles);
      } catch (error) {
        setError(error.message);
      }
    }
    getArticles();
  }, []);

  const handleArticleSubmitted = () => {
    async function refreshArticles() {
      try {
        const articles = await fetchJSON("/api/articles");
        setArticles(articles);
      } catch (error) {
        setError(error.message);
      }
    }
    refreshArticles();
  };

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
      <ArticleForm onArticleSubmitted={handleArticleSubmitted} />
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
