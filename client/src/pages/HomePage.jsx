import React, { useState, useEffect } from "react";
import { fetchJSON } from "../api/fetchJSON";
import { Link } from "react-router-dom";
import "./HomePage.css";
import LoginButton from "../components/LoginButton";

const HomePage = () => {
  const [articles, setArticles] = useState([]);
  const [error, setError] = useState(null);

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

  return (
    <div className="homepage-container">
      <LoginButton />

      <h1 className="homepage-title">News Articles</h1>
      {error && <div className="error-message">Error: {error}</div>}
      <ul className="article-list">
        {articles.map((article) => (
          <li key={article._id} className="article-item">
            <Link to={`/article/${article._id}`} className="article-link">
              {article.title}
            </Link>
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
