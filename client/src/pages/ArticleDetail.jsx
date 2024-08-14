import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchJSON } from "../api/fetchJSON";
import "./ArticleDetail.css";

const ArticleDetail = () => {
  const { id } = useParams(); // Får artikkelens ID fra URL-en
  const [article, setArticle] = useState(null);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
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
        setError(error.message);
      }
    }
    getArticle();
  }, [id]);

  async function handleSave() {
    try {
      await fetch(`/api/articles/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, content, image }),
      });
      setEditMode(false);
    } catch (error) {
      setError(error.message);
    }
  }

  async function handleDelete() {
    try {
      await fetch(`/api/articles/${id}`, {
        method: "DELETE",
      });
      navigate("/"); // Naviger tilbake til hjemmesiden etter sletting
    } catch (error) {
      setError(error.message);
    }
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!article) {
    return <div>Loading...</div>;
  }

  return (
    <div className="article-detail-container">
      {editMode ? (
        <div>
          <h1>Edit Article</h1>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
          />
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Content"
          />
          <input
            type="text"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            placeholder="Image URL"
          />
          <button onClick={handleSave}>Save</button>
          <button onClick={() => setEditMode(false)}>Cancel</button>
        </div>
      ) : (
        <div>
          <h1>{article.title}</h1>
          <p>{article.content}</p>
          {article.image && <img src={article.image} alt={article.title} />}
          <button onClick={() => setEditMode(true)}>Edit</button>
          <button onClick={handleDelete}>Delete</button>
        </div>
      )}
    </div>
  );
};

export default ArticleDetail;
