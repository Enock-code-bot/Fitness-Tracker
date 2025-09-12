import express from 'express';
import {
  getGoogleOAuthUrl,
  exchangeGoogleCodeForTokens,
  fetchGoogleFitData,
  getAppleOAuthUrl,
  exchangeAppleCodeForTokens,
  fetchAppleHealthData,
} from './fitnessIntegration';

const router = express.Router();

// Route to get Google OAuth URL
router.get('/auth/google/url', (req: express.Request, res: express.Response) => {
  const state = req.query.state as string || '';
  const url = getGoogleOAuthUrl(state);
  res.json({ url });
});

// Route to handle Google OAuth callback and exchange code for tokens
router.post('/auth/google/token', async (req: express.Request, res: express.Response) => {
  const { code } = req.body;
  try {
    const tokens = await exchangeGoogleCodeForTokens(code);
    res.json(tokens);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ error: message });
  }
});

// Route to fetch Google Fit data
router.get('/google-fit/data', async (req: express.Request, res: express.Response) => {
  const accessToken = req.headers.authorization?.split(' ')[1];
  if (!accessToken) {
    return res.status(401).json({ error: 'Access token required' });
  }
  try {
    const data = await fetchGoogleFitData(accessToken);
    res.json(data);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ error: message });
  }
});

// Placeholder routes for Apple HealthKit
router.get('/auth/apple/url', async (req: express.Request, res: express.Response) => {
  const state = req.query.state as string || '';
  const url = await getAppleOAuthUrl(state);
  res.json({ url });
});

router.post('/auth/apple/token', async (req: express.Request, res: express.Response) => {
  const { code } = req.body;
  try {
    const tokens = await exchangeAppleCodeForTokens(code);
    res.json(tokens);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ error: message });
  }
});

router.get('/apple-health/data', async (req: express.Request, res: express.Response) => {
  const accessToken = req.headers.authorization?.split(' ')[1];
  if (!accessToken) {
    return res.status(401).json({ error: 'Access token required' });
  }
  try {
    const data = await fetchAppleHealthData(accessToken);
    res.json(data);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ error: message });
  }
});

export default router;
