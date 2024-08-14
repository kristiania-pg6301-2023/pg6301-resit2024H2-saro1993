import express from "express";
import { oauth2Client } from './oauthClientSetup.js';

export function createAuthRouter(db, { openid_configuration, client_id }) {
  const userRouter = express.Router();
  // Route to start the OAuth flow
  userRouter.get('/auth/google', (req, res) => {
    const authUrl = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: ['profile', 'email'],
    });
    res.redirect(authUrl);
  });

  // Route to handle the OAuth callback
  userRouter.get('/auth/google/callback', async (req, res) => {
    const { code } = req.query;
    try {
      const { tokens } = await oauth2Client.getToken(code);
      oauth2Client.setCredentials(tokens);
      // Redirect or respond based on successful authentication
      res.redirect('/some/success/page');
    } catch (error) {
      console.error('Error during the OAuth callback', error);
      res.redirect('/some/error/page');
    }
  });

  return userRouter;
}