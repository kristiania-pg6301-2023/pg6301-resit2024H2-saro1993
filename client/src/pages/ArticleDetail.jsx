import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchJSON } from "../api/fetchJSON";
import { UserContext } from "../context/UserContext";
import "./ArticleDetail.css";

function ArticleDetail() {
  const { id } = useParams();
  const { user } = useContext(UserContext);
  const [article, setArticle] = useState(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    async function getArticle() {
      try {
        const article = await fetchJSON(`/api/articles/${id}`);
        setArticle(article);
        setTitle(article.title);
        setContent(article.content);
        setImage(article.image);
      } catch (error) {
        console.error("Failed to fetch article", error);
      }
    }
    getArticle();
  }, [id]);

  async function handleSave() {
    if (!user) {
      console.error("User is not logged in. Aborting save.");
      return;
    }

    const updatedArticle = {
      title,
      content,
      image,
      lastModifiedBy: user ? user.name : "Anonym",
      lastModifiedEmail: user ? user.email : null,
    };

    try {
      const response = await fetch(`/api/articles/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("access_token")}`,
        },
        body: JSON.stringify(updatedArticle),
      });

      if (response.ok) {
        navigate("/home");
      } else {
        console.error("Failed to update article");
      }
    } catch (error) {
      console.error("Failed to update article", error);
    }
  }

  const handleBackToHome = () => {
    navigate("/home");
  };

  if (!article) {
    return <div>Loading...</div>;
  }

  return (
    <div className="article-detail-container">
      <h1 className="article-detail-title">Edit Article</h1>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
        className="article-detail-input"
      />
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Content"
        className="article-detail-textarea"
      />
      <input
        type="text"
        value={image}
        onChange={(e) => setImage(e.target.value)}
        placeholder="Image URL"
        className="article-detail-input"
      />
      <button onClick={handleSave} className="article-detail-button">
        Save
      </button>
      <button
        onClick={handleBackToHome}
        className="article-detail-button article-detail-back-button"
      >
        Back to Home
      </button>
      {article.lastModifiedBy && (
        <p className="article-detail-footer">
          Last modified by: {article.lastModifiedBy}{" "}
          {article.lastModifiedEmail && `(${article.lastModifiedEmail})`}
        </p>
      )}
    </div>
  );
}

export default ArticleDetail;
