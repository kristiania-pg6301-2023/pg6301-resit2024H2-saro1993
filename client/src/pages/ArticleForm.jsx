import React, { useState, useContext } from "react";
import { UserContext } from "../context/UserContext";
import "./ArticleForm.css";

function ArticleForm({ onArticleSubmitted }) {
  const { user } = useContext(UserContext);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState("");
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();

    if (!title || !content) {
      setError("Title and content are required.");
      return;
    }

    const newArticle = {
      title,
      content,
      image,
      author: user ? user.name : "Anonym",
    };

    try {
      const response = await fetch("/api/articles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newArticle),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(`Failed to submit article: ${errorData.message || response.statusText}`);
        return;
      }

      setTitle("");
      setContent("");
      setImage("");
      setError(null);
      onArticleSubmitted();
    } catch (error) {
      console.error("Error submitting article", error);
      setError("Failed to submit article due to a network or server error.");
    }
  }

  return (
    <form className="article-form" onSubmit={handleSubmit}>
      <h2>Create New Article</h2>
      {error && <div className="error-message">{error}</div>}
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
        className="article-form-input"
      />
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Content"
        className="article-form-textarea"
      />
      <input
        type="text"
        value={image}
        onChange={(e) => setImage(e.target.value)}
        placeholder="Image URL (optional)"
        className="article-form-input"
      />
      <button type="submit" className="article-form-button">
        Submit Article
      </button>
    </form>
  );
}

export default ArticleForm;
