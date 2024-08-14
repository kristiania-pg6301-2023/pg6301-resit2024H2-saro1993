import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { fetchJSON } from "../api/fetchJSON";

const ArticlePage = () => {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function getArticle() {
      try {
        const article = await fetchJSON(`/api/articles/${id}`);
        setArticle(article);
      } catch (error) {
        setError(error.message);
      }
    }
    getArticle();
  }, [id]);

  if (error) return <div>Error: {error}</div>;
  if (!article) return <div>Loading...</div>;

  return (
    <div>
      <h1>{article.title}</h1>
      <p>{article.content}</p>
      <p>Category: {article.category}</p>
      <p>Author: {article.author}</p>
      <p>Published at: {new Date(article.publishedAt).toLocaleDateString()}</p>
    </div>
  );
};

export default ArticlePage;
