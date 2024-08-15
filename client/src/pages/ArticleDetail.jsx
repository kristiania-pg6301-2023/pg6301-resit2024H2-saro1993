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
  const [isEditing, setIsEditing] = useState(false);
  const [saveMessage, setSaveMessage] = useState(""); // For displaying save messages
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
    const token = sessionStorage.getItem("access_token");

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
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify(updatedArticle),
      });

      if (response.ok) {
        const updatedData = await response.json();
        setArticle(updatedData);
        setTitle(updatedData.title); // Update the title with the new value
        setIsEditing(false);
        setSaveMessage("Article saved successfully!");
        setTimeout(() => setSaveMessage(""), 3000);
      } else {
        console.error("Failed to update article");
        setSaveMessage("Failed to save article.");
        setTimeout(() => setSaveMessage(""), 3000);
      }
    } catch (error) {
      console.error("Failed to update article", error);
      setSaveMessage("Failed to save article due to an error.");
      setTimeout(() => setSaveMessage(""), 3000);
    }
  }

  async function handleDelete() {
    try {
      const response = await fetch(`/api/articles/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        navigate("/home");
      } else {
        console.error("Failed to delete article");
      }
    } catch (error) {
      console.error("Failed to delete article", error);
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
      {isEditing ? (
        <>
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
            onClick={() => setIsEditing(false)}
            className="article-detail-button article-detail-back-button"
          >
            Cancel
          </button>
          {saveMessage && <p className="save-message">{saveMessage}</p>}
        </>
      ) : (
        <>
          <h1 className="article-detail-title">{title}</h1> {/* Reflect updated title */}
          <p className="article-detail-content">{content}</p>
          {image && (
            <img src={image} alt={title} className="article-detail-image" />
          )}
          <div className="article-detail-footer">
            <p>Author: {article.author}</p>
            {article.lastModifiedBy && (
              <p>
                Last modified by: {article.lastModifiedBy}{" "}
                {article.lastModifiedEmail && `(${article.lastModifiedEmail})`}
              </p>
            )}
          </div>
          <div className="article-detail-actions">
            <button onClick={() => setIsEditing(true)} className="article-detail-button">
              Edit
            </button>
            <button onClick={handleDelete} className="article-detail-button">
              Delete
            </button>
          </div>
          <button
            onClick={handleBackToHome}
            className="article-detail-button article-detail-back-button"
          >
            Back to Home
          </button>
        </>
      )}
    </div>
  );
}

export default ArticleDetail;
