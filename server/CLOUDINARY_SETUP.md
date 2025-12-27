# Cloudinary Setup for CafeChain

## Environment Variables Required

Add these to your `.env` file:

```env
# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

## Installation

1. Install dependencies:
```bash
npm install
```

2. Get your Cloudinary credentials:
   - Sign up at [cloudinary.com](https://cloudinary.com)
   - Go to Dashboard > API Keys
   - Copy your Cloud Name, API Key, and API Secret

3. Update your `.env` file with the credentials

4. Start the server:
```bash
npm run dev
```

## How It Works

- Profile pictures are uploaded as base64 strings from the frontend
- The Cloudinary middleware processes the base64 data and uploads it to Cloudinary
- The secure URL is stored in the user's profilePic field
- Images are automatically optimized (400x400, face detection, quality optimization)
- Images are stored in the 'cafechain-profiles' folder on Cloudinary

## Benefits

- No local file storage needed
- Automatic image optimization
- CDN delivery for fast loading
- Scalable cloud storage
- Professional image transformations
