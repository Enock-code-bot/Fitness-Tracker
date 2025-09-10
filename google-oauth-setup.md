# Google OAuth Setup Guide for FitTracker

## Prerequisites
- Google account
- Supabase account
- FitTracker project running locally

## Step 1: Google Cloud Console Setup

### 1.1 Create Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Select a project" (top left)
3. Click "New Project"
4. Enter project name: `fittracker-oauth`
5. Click "Create"

### 1.2 Enable Required APIs
1. Go to "APIs & Services" > "Library"
2. Search for "Google+ API"
3. Click on "Google+ API"
4. Click "Enable"

### 1.3 Create OAuth Credentials
1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth 2.0 Client IDs"
3. Choose "Web application"
4. Name: `FitTracker Web App`
5. Add authorized redirect URIs:
   ```
   https://yqjjmrdpibcbtpfartvb.supabase.co/auth/v1/callback
   http://localhost:5177/
   ```
6. Click "Create"
7. **Save the Client ID and Client Secret** - you'll need these for Supabase

## Step 2: Supabase Configuration

### 2.1 Access Supabase Dashboard
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project: `yqjjmrdpibcbtpfartvb`

### 2.2 Configure Google Provider
1. Click "Authentication" in left sidebar
2. Click "Providers"
3. Find "Google" in the list
4. Toggle "Enable sign in with Google"
5. Enter your Client ID from Google Cloud Console
6. Enter your Client Secret from Google Cloud Console
7. Click "Save"

## Step 3: Test the Configuration

### 3.1 Start Local Development
```bash
npm run dev
```

### 3.2 Test OAuth Flow
1. Open `http://localhost:5177`
2. Click "Sign in" (not sign up)
3. Click "Continue with Google"
4. Complete Google authentication
5. Verify you're redirected back to the app and logged in

## Troubleshooting

### Error: "Unsupported provider"
- Check if Google provider is enabled in Supabase
- Verify Client ID and Secret are correct
- Ensure redirect URLs match exactly

### Error: "Invalid OAuth access token"
- Check Google Cloud Console credentials
- Verify Google+ API is enabled
- Confirm authorized redirect URIs are correct

### Redirect Issues
- Clear browser cache and cookies
- Check that redirect URL in Supabase matches Google Console
- Verify local development URL is added to Google Console

## Configuration Summary

After successful setup, you should have:
- ✅ Google Cloud project with OAuth credentials
- ✅ Google+ API enabled
- ✅ Supabase Google provider configured
- ✅ Working OAuth authentication flow
- ✅ Automatic profile creation for new users

## Need Help?

If you encounter any issues:
1. Check the browser console for error messages
2. Verify all URLs match exactly
3. Ensure APIs are enabled
4. Try clearing browser cache
5. Check Supabase logs for authentication errors
