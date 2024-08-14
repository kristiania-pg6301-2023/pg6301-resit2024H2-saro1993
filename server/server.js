import express from 'express';
import cookieParser from 'cookie-parser';
import path from 'path';
import dotenv from 'dotenv';
import { MongoClient, ObjectId } from 'mongodb';
import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';
import cors from 'cors';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const client = new OAuth2Client(process.env.CLIENT_ID, process.env.CLIENT_SECRET);

app.use(express.json());
app.use(cookieParser());
app.use(cors());

// Connect to MongoDB
MongoClient.connect(process.env.MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async (connection) => {
    const db = connection.db("articles");
    console.log("Connected to MongoDB");

    const articlesCollection = db.collection('articles');

    // Google OAuth authentication routes
    app.get('/auth/google', (req, res) => {
      const redirectUri = `${process.env.BASE_URL}/auth/google/callback`;
      const authorizationUrl = client.generateAuthUrl({
        access_type: 'offline',
        scope: ['profile', 'email'],
        redirect_uri: redirectUri,
      });
      res.redirect(authorizationUrl);
    });

    app.get('/auth/google/callback', async (req, res) => {
      try {
        const { code } = req.query;
        const redirectUri = `${process.env.BASE_URL}/auth/google/callback`;

        const { tokens } = await client.getToken({ code, redirect_uri: redirectUri });
        const ticket = await client.verifyIdToken({
          idToken: tokens.id_token,
          audience: process.env.CLIENT_ID,
        });

        const payload = ticket.getPayload();
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.cookie('token', token, { httpOnly: true });
        res.redirect('/profile');
      } catch (error) {
        console.error('Error during Google authentication:', error);
        res.status(500).send('Authentication failed');
      }
    });

    app.get("/profile", (req, res) => {
      const token = req.cookies.token;
      if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        res.json(decoded);
      } catch (error) {
        console.error("Failed to verify token:", error);
        res.status(401).json({ message: "Unauthorized" });
      }
    });

    app.get('/auth/logout', (req, res) => {
      res.clearCookie('token');
      res.redirect('/');
    });

    // Middleware to check and verify JWT from Authorization header
    app.use(async (req, res, next) => {
      const authorization = req.header("Authorization");
      if (authorization) {
        try {
          const { userinfo_endpoint } = await fetchJSON(
            "https://accounts.google.com/.well-known/openid-configuration"
          );
          req.userinfo = await fetchJSON(userinfo_endpoint, {
            headers: { Authorization: authorization },
          });
        } catch (error) {
          console.error("Failed to fetch user info:", error.message);
          return res.status(401).json({ message: "Unauthorized" });
        }
      }
      next();
    });

    // Fetch all articles from MongoDB
    app.get('/api/articles', async (req, res) => {
      const articles = await articlesCollection.find({}).toArray();
      res.json(articles);
    });

    // Fetch a single article by ID
    app.get('/api/articles/:id', async (req, res) => {
      try {
        const article = await articlesCollection.findOne({ _id: new ObjectId(req.params.id) });
        if (!article) {
          return res.status(404).json({ message: "Article not found" });
        }
        res.json(article);
      } catch (error) {
        res.status(500).json({ message: "Error fetching article" });
      }
    });

    // Create an article
    app.post('/api/articles', async (req, res) => {
      const { title, content, image, author } = req.body;

      if (!title || !content || !author) {
        return res.status(400).json({ message: 'Title, content, and author are required.' });
      }

      try {
        const newArticle = {
          title,
          content,
          image: image || null,
          author,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        const result = await articlesCollection.insertOne(newArticle);

        if (result.acknowledged) {
          res.status(201).json({ message: 'Article created successfully' });
        } else {
          res.status(500).json({ message: 'Failed to create article' });
        }
      } catch (error) {
        console.error('Error creating article:', error);
        res.status(500).json({ message: 'Failed to create article due to server error' });
      }
    });

    // Update an article by ID
    app.put('/api/articles/:id', async (req, res) => {
      try {
        const { id } = req.params;
        const { title, content, image, lastModifiedBy, lastModifiedEmail } = req.body;

        const result = await articlesCollection.updateOne(
          { _id: new ObjectId(id) },
          {
            $set: {
              title,
              content,
              image,
              lastModifiedBy,
              lastModifiedEmail,
              modifiedAt: new Date(),
            },
          }
        );

        if (result.matchedCount === 1) {
          res.status(200).json({ message: "Article updated successfully" });
        } else {
          res.status(404).json({ message: "Article not found" });
        }
      } catch (error) {
        console.error("Error updating article", error);
        res.status(500).json({ message: "Error updating article" });
      }
    });

    // Delete an article by ID
    app.delete('/api/articles/:id', async (req, res) => {
      try {
        const result = await articlesCollection.deleteOne({ _id: new ObjectId(req.params.id) });
        if (result.deletedCount === 1) {
          res.status(200).json({ message: "Article deleted successfully" });
        } else {
          res.status(404).json({ message: "Article not found" });
        }
      } catch (error) {
        res.status(500).json({ message: "Error deleting article" });
      }
    });

    // Serve static files
    app.use(express.static(path.resolve('../client/dist')));

    // Handle all other routes by serving the frontend
    app.get('*', (req, res) => {
      res.sendFile(path.resolve('../client/dist/index.html'));
    });

    // Helper function to fetch JSON
    async function fetchJSON(url, options = {}) {
      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`);
      }
      return await response.json();
    }

    // Start the server
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => console.error('Failed to connect to MongoDB', error));
