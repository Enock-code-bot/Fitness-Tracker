// Removed unused imports and variables to fix lint errors
// Removed 'node-fetch' import as it is not used in this environment

// Google Fit OAuth URLs and scopes
const googleOAuthConfig = {
  clientId: process.env.GOOGLE_CLIENT_ID || '',
  clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
  redirectUri: process.env.GOOGLE_REDIRECT_URI || '',
  scopes: [
    'https://www.googleapis.com/auth/fitness.activity.read',
    'https://www.googleapis.com/auth/fitness.body.read',
    'https://www.googleapis.com/auth/fitness.location.read',
    'https://www.googleapis.com/auth/fitness.nutrition.read',
  ],
};

// Function to generate Google OAuth URL
export function getGoogleOAuthUrl(state: string): string {
  const baseUrl = 'https://accounts.google.com/o/oauth2/v2/auth';
  const params = new URLSearchParams({
    client_id: googleOAuthConfig.clientId,
    redirect_uri: googleOAuthConfig.redirectUri,
    response_type: 'code',
    scope: googleOAuthConfig.scopes.join(' '),
    access_type: 'offline',
    state,
    prompt: 'consent',
  });
  return `${baseUrl}?${params.toString()}`;
}

// Function to exchange Google OAuth code for tokens
export async function exchangeGoogleCodeForTokens(code: string) {
  const tokenUrl = 'https://oauth2.googleapis.com/token';
  const params = new URLSearchParams({
    code,
    client_id: googleOAuthConfig.clientId,
    client_secret: googleOAuthConfig.clientSecret,
    redirect_uri: googleOAuthConfig.redirectUri,
    grant_type: 'authorization_code',
  });

  const response = await fetch(tokenUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params.toString(),
  });

  if (!response.ok) {
    throw new Error(`Failed to exchange code: ${response.statusText}`);
  }

  const tokens = await response.json();
  return tokens;
}

// Function to fetch Google Fit data using access token
export async function fetchGoogleFitData(accessToken: string) {
  const url = 'https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate';
  // Example request body for aggregated step count data
  const body = {
    aggregateBy: [
      {
        dataTypeName: 'com.google.step_count.delta',
      },
    ],
    bucketByTime: { durationMillis: 86400000 }, // daily buckets
    startTimeMillis: Date.now() - 7 * 24 * 60 * 60 * 1000, // last 7 days
    endTimeMillis: Date.now(),
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch Google Fit data: ${response.statusText}`);
  }

  const data = await response.json();
  return data;
}

// Placeholder functions for Apple HealthKit integration
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function getAppleOAuthUrl(_state: string): Promise<string> {
  // Apple HealthKit OAuth flow is complex and requires iOS app integration
  // This is a placeholder to be implemented as per Apple's guidelines
  return '';
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function exchangeAppleCodeForTokens(_code: string) {
  // Placeholder for exchanging Apple OAuth code for tokens
  return {};
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function fetchAppleHealthData(_accessToken: string) {
  // Placeholder for fetching Apple HealthKit data
  return {};
}
