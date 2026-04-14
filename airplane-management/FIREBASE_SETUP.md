# Firebase Setup Guide

## Step 1 — Create Firebase Project
1. Go to https://console.firebase.google.com
2. Click "Add project" → name it (e.g. `skywings-airlines`)
3. Disable Google Analytics (optional) → Create project

## Step 2 — Enable Authentication
1. In Firebase Console → **Authentication** → Get Started
2. Click **Sign-in method** → Enable **Email/Password**

## Step 3 — Create Firestore Database
1. Go to **Firestore Database** → Create database
2. Choose **Start in test mode** (for development)
3. Select a region → Done

## Step 4 — Get Firebase Config
1. Go to **Project Settings** (gear icon) → **General**
2. Scroll to "Your apps" → Click **</>** (Web)
3. Register app name → Copy the `firebaseConfig` object

## Step 5 — Add Config to Project
Open `src/firebase/config.js` and replace the placeholder values:

```js
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};
```

## Step 6 — Firestore Security Rules (Production)
In Firestore → Rules, replace with:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId;
    }
    match /flights/{flightId} {
      allow read: if true;
      allow write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    match /bookings/{bookingId} {
      allow read: if request.auth != null && 
        (resource.data.userId == request.auth.uid || 
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin');
      allow create: if request.auth != null;
      allow update: if request.auth != null && resource.data.userId == request.auth.uid;
    }
  }
}
```

## Step 7 — Create Composite Index (for flight search)
Firestore requires a composite index for the search query.
When you first run a search, Firebase will show an error with a direct link to create the index.
Click that link and create the index for: `flights` collection → `from ASC, to ASC, date ASC`

---

# Running Locally

```bash
npm install
npm run dev
```

Open http://localhost:5173

# Deploy to Firebase Hosting

```bash
npm install -g firebase-tools
firebase login
firebase init hosting   # select dist as public dir, SPA: yes
npm run build
firebase deploy
```
