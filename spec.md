# Medola

## Current State
Scaffold only -- no App.tsx, no backend logic, no UI.

## Requested Changes (Diff)

### Add
- User sign up / login (Internet Identity)
- Home feed showing photo and video posts (reels-style)
- Upload photo and video posts with caption
- Like and comment on posts
- Friend requests: send, accept, decline
- User profile page with posts grid
- Audio/video call UI (simulated UI, no real WebRTC backend needed)
- Bottom navigation: Home, Reels, Upload, Friends, Profile

### Modify
- None (new project)

### Remove
- None

## Implementation Plan
1. Backend: users, posts (photo/video), friend requests, likes, comments stored in Motoko stable memory. Blob storage for media.
2. Frontend: multi-page app with bottom nav. Feed page, reels page, upload page, friends page, profile page, call UI modal.
3. Authorization component for login/signup.
4. Blob-storage component for photo/video uploads.
