import express from "express";

const router = express.Router();

// GET all articles
router.get("/", async (req, res) => {
  try {
    const articles = await req.db.collection("articles").find().toArray();
    res.json(articles);
  } catch (err) {
    res.status(500).json({ message: err.message });
    
  }
});

// POST a new article
router.post("/", async (req, res) => {
  const { title } = req.body;
  try {
    const existingArticle = await req.db.collection("articles").findOne({ title });
    if (existingArticle) {
      return res.status(400).json({ message: "Article with this title already exists" });
    }

    const article = {
      ...req.body,
      publishedAt: new Date(),
    };

    await req.db.collection("articles").insertOne(article);
    res.status(201).json(article);

    // Emit event to all clients
    req.io.emit("articlePublished", article);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT to update an article
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const article = await req.db.collection("articles").findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: req.body },
      { returnOriginal: false }
    );
    res.json(article.value);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE an article
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await req.db.collection("articles").deleteOne({ _id: new ObjectId(id) });
    res.json({ message: "Article deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
