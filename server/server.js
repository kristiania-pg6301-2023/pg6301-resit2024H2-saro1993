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
app.use(cors())

// Connect to MongoDB
MongoClient.connect(process.env.MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async (connection) => {
    const db = connection.db("articles");
    console.log("Connected to MongoDB");

    const articlesCollection = db.collection('articles');

    // Upsert articles (insert if not exist, update if exist)
    const articles = [
      {
        title: "Tech News 2024",
        content: "Latest advancements in AI are transforming industries.",
        image: "https://media.istockphoto.com/id/1409309637/vector/breaking-news-label-banner-isolated-vector-design.jpg?s=612x612&w=0&k=20&c=JoQHezk8t4hw8xXR1_DtTeWELoUzroAevPHo0Lth2Ow=",
        author: "sam"
      },
      {
        title: "Global Economy 2024",
        content: "Predictions for the global economy in 2024.",
        image: "https://media.istockphoto.com/id/1409309637/vector/breaking-news-label-banner-isolated-vector-design.jpg?s=612x612&w=0&k=20&c=JoQHezk8t4hw8xXR1_DtTeWELoUzroAevPHo0Lth2Ow=",
        author: "erik"
      },
      {
        title: "Environmental Conservation",
        content: "New initiatives to preserve the environment.",
        image: "https://media.istockphoto.com/id/1409309637/vector/breaking-news-label-banner-isolated-vector-design.jpg?s=612x612&w=0&k=20&c=JoQHezk8t4hw8xXR1_DtTeWELoUzroAevPHo0Lth2Ow=",
        author: "emil"
      },
      {
        title: "Health: Tips for Busy People",
        content: "Tips for staying healthy in a busy world.",
        image: "https://media.istockphoto.com/id/1409309637/vector/breaking-news-label-banner-isolated-vector-design.jpg?s=612x612&w=0&k=20&c=JoQHezk8t4hw8xXR1_DtTeWELoUzroAevPHo0Lth2Ow=",
        author: "sirwan"
      },
      {
        title: "NASA's Future Plans",
        content: "The future of human space exploration.",
        image: "https://media.istockphoto.com/id/1409309637/vector/breaking-news-label-banner-isolated-vector-design.jpg?s=612x612&w=0&k=20&c=JoQHezk8t4hw8xXR1_DtTeWELoUzroAevPHo0Lth2Ow=",
        author: "elham"
      },
      {
        title: "Art Appreciation",
        content: "Understanding the meaning behind modern art.",
        image: "https://media.istockphoto.com/id/1409309637/vector/breaking-news-label-banner-isolated-vector-design.jpg?s=612x612&w=0&k=20&c=JoQHezk8t4hw8xXR1_DtTeWELoUzroAevPHo0Lth2Ow=",
        author: "soran"
      },
      {
        title: "Technological Innovation",
        content: "How technology is changing the world.",
        image: "https://media.istockphoto.com/id/1409309637/vector/breaking-news-label-banner-isolated-vector-design.jpg?s=612x612&w=0&k=20&c=JoQHezk8t4hw8xXR1_DtTeWELoUzroAevPHo0Lth2Ow=",
        author: "helene"
      },
      {
        title: "World Politics Today",
        content: "A deep dive into current world politics.",
        image: "https://media.istockphoto.com/id/1409309637/vector/breaking-news-label-banner-isolated-vector-design.jpg?s=612x612&w=0&k=20&c=JoQHezk8t4hw8xXR1_DtTeWELoUzroAevPHo0Lth2Ow=",
        author: "nikolas"
      },
      {
        title: "Digital Transformation",
        content: "How businesses are going digital.",
        image: "https://media.istockphoto.com/id/1409309637/vector/breaking-news-label-banner-isolated-vector-design.jpg?s=612x612&w=0&k=20&c=JoQHezk8t4hw8xXR1_DtTeWELoUzroAevPHo0Lth2Ow=",
        author: "eff"
      },
      {
        title: "AI",
        content: "The ethical implications of AI technology.",
        image: "https://media.istockphoto.com/id/1409309637/vector/breaking-news-label-banner-isolated-vector-design.jpg?s=612x612&w=0&k=20&c=JoQHezk8t4hw8xXR1_DtTeWELoUzroAevPHo0Lth2Ow=",
        author: "nic"
      }
        ];

    for (let article of articles) {
      await articlesCollection.updateOne(
        { title: article.title }, 
        { $set: article },        
        { upsert: true }  
      );
    }

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

    app.use(async (req, res, next) => {
      const authorization = req.header("Authorization");
      if (authorization) {
        const { userinfo_endpoint } = await fetchJSON(
          "https://accounts.google.com/.well-known/openid-configuration"
        );
        req.userinfo = await fetchJSON(userinfo_endpoint, {
          headers: { authorization },
        });
      }
      next();
    });
    
    app.get("/profile", (req, res) => {
      if (!req.userinfo) {
        return res.sendStatus(200);
      }
      res.send(req.userinfo);
    });
    // auth/logout
    app.get('/auth/logout', (req, res) => {
      res.clearCookie('token');
      res.redirect('/');
    });
    //reset cookie token for logout
    app.get('/auth/logout', (req, res) => {
      res.clearCookie('token');
      res.redirect('/');
    });
    // update article
    app.put('/api/articles/:id', async (req, res) => {
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
    
    //delete alle user tokens
    app.delete("/auth/logout", (req, res) => {
      res.clearCookie("token");
      res.redirect("/");
    });

    app.get('/auth/logout', (req, res) => {
      res.clearCookie('token');  
      res.redirect('/');  
    }); 

    // Update an article by ID
    app.put('/api/articles/:id', async (req, res) => {
      try {
        const { id } = req.params;
        const { title, content, image } = req.body;
        const result = await articlesCollection.updateOne(
          { _id: new ObjectId(id) },
          { $set: { title, content, image } }
        );
        if (result.matchedCount === 1) {
          res.status(200).json({ message: "Article updated successfully" });
        } else {
          res.status(404).json({ message: "Article not found" });
        }
      } catch (error) {
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
    // /auth/google/callback
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
    app.get("/auth/logout", (req, res) => {
      res.clearCookie("token");
      res.redirect("/");
    }
    );

    // Serve static files
    app.use(express.static(path.resolve('../client/dist')));

    // Handle all other routes by serving the frontend
    app.get('*', (req, res) => {
      res.sendFile(path.resolve('../client/dist/index.html'));
    });
    // fetchJSON
    async function fetchJSON(url, options = {}) {
      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`);
      }
      return await response.json();
    }
    

    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => console.error('Failed to connect to MongoDB', error));


