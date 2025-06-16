# DSE History Revision App

A React application for DSE History revision with AI-powered features.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env.local` file in the root directory with the following variables:
```
REACT_APP_FIREWORKS_API_KEY=your_fireworks_api_key_here
REACT_APP_FIREBASE_API_KEY=your_firebase_api_key_here
REACT_APP_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain_here
REACT_APP_FIREBASE_PROJECT_ID=your_firebase_project_id_here
REACT_APP_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket_here
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id_here
REACT_APP_FIREBASE_APP_ID=your_firebase_app_id_here
```

3. Start the development server:
```bash
npm start
```

## Deployment with Firebase

1. Install Firebase CLI:
```bash
npm install -g firebase-tools
```

2. Login to Firebase:
```bash
firebase login
```

3. Initialize Firebase:
```bash
firebase init
```
Select the following options:
- Choose "Hosting"
- Select your Firebase project
- Set `build` as your public directory
- Configure as a single-page app: Yes
- Set up automatic builds and deploys: No

4. Build and deploy:
```bash
npm run build
firebase deploy
```

Your app will be available at `https://your-project-id.web.app`

## Environment Variables
Make sure to set up the following environment variables in your Firebase project:
- `REACT_APP_FIREWORKS_API_KEY`
- `REACT_APP_FIREBASE_API_KEY`
- `REACT_APP_FIREBASE_AUTH_DOMAIN`
- `REACT_APP_FIREBASE_PROJECT_ID`
- `REACT_APP_FIREBASE_STORAGE_BUCKET`
- `REACT_APP_FIREBASE_MESSAGING_SENDER_ID`
- `REACT_APP_FIREBASE_APP_ID`