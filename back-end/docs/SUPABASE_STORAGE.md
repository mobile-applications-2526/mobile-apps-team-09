# Supabase Storage Integration Guide

## Overview

This backend uses Supabase Storage for managing image uploads (user avatars, plant images, and diagnosis photos). Images are stored in cloud storage and accessed via public URLs.

## Architecture

### Storage Buckets

Three separate buckets for different image types:

- **`user-avatars`**: User profile pictures (5MB limit)
- **`plant-images`**: Plant photos organized by user folders (10MB limit)
- **`diagnosis-images`**: Disease diagnosis images organized by user folders (10MB limit)

### File Organization

```
diagnosis-images/
├── 1/                              # User ID folder
│   ├── diagnosis_uuid1_uuid2.jpg
│   └── diagnosis_uuid3_uuid4.jpg
└── 2/
    └── diagnosis_uuid5_uuid6.jpg

plant-images/
├── 1/
│   ├── plant_5_uuid.jpg
│   └── plant_12_uuid.jpg
└── 2/
    └── plant_3_uuid.jpg

user-avatars/
├── 1_uuid.jpg
├── 2_uuid.jpg
└── 3_uuid.jpg
```

## Setup Instructions

### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and create an account
2. Create a new project
3. Note your project URL (e.g., `https://xxxxx.supabase.co`)

### 2. Get API Keys

1. Go to Project Settings → API
2. Copy the following keys:
   - **`anon` key** (public key for frontend)
   - **`service_role` key** (secret key for backend operations)

### 3. Create Storage Buckets

1. Go to Storage section in Supabase dashboard
2. Create three **public** buckets:
   - `user-avatars`
   - `plant-images`
   - `diagnosis-images`

### 4. Configure Row Level Security (RLS) Policies

For **each bucket**, you need to disable RLS or add policies:

#### Option A: Disable RLS (Simple - for development)

1. Click on bucket name
2. Go to "Configuration" tab
3. Toggle "Enable RLS" to OFF

#### Option B: Add Public Policies (Recommended - for production)

1. Click on bucket name
2. Go to "Policies" tab
3. Click "New Policy"
4. Select "For full customization"
5. Configure policy:
   - **Policy name**: `Allow all operations`
   - **Allowed operations**: Check ALL (SELECT, INSERT, UPDATE, DELETE)
   - **Target roles**: `Defaults to all (public) roles if none selected`
   - **Policy definition**: Enter `true`
6. Click "Review" then "Save policy"

Repeat for all three buckets.

### 5. Update Backend Environment Variables

Add to your `.env` file:

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

### 6. Update Docker Compose

Make sure `docker-compose.yml` passes the environment variables to the container:

```yaml
services:
  backend:
    environment:
      - SUPABASE_URL=${SUPABASE_URL}
      - SUPABASE_KEY=${SUPABASE_KEY}
      - SUPABASE_SERVICE_ROLE_KEY=${SUPABASE_SERVICE_ROLE_KEY}
```

### 7. Restart Backend

```bash
docker-compose down
docker-compose up -d
```

## API Endpoints

### Upload Diagnosis Image

**POST** `/api/v1/uploads/diagnosis/image`

Upload an image before creating a diagnosis record.

**Headers:**

- `Authorization: Bearer <jwt-token>`

**Body:** `multipart/form-data`

- `file`: Image file (jpg, jpeg, png, webp)

**Response:**

```json
{
  "image_url": "https://xxxxx.supabase.co/storage/v1/object/public/diagnosis-images/2/diagnosis_uuid_uuid.jpg"
}
```

**Usage Flow:**

1. Upload image to get URL
2. Create diagnosis record with the returned URL
3. Display image in app using the URL

### Upload Plant Image

**POST** `/api/v1/uploads/plant/{plant_id}/image`

Upload an image for an existing plant.

**Headers:**

- `Authorization: Bearer <jwt-token>`

**Path Parameters:**

- `plant_id`: ID of the plant

**Body:** `multipart/form-data`

- `file`: Image file (jpg, jpeg, png, webp)

**Response:**

```json
{
  "image_url": "https://xxxxx.supabase.co/storage/v1/object/public/plant-images/2/plant_5_uuid.jpg"
}
```

### Upload User Avatar

**POST** `/api/v1/uploads/user/avatar`

Upload a profile picture for the authenticated user.

**Headers:**

- `Authorization: Bearer <jwt-token>`

**Body:** `multipart/form-data`

- `file`: Image file (jpg, jpeg, png, webp)

**Response:**

```json
{
  "image_url": "https://xxxxx.supabase.co/storage/v1/object/public/user-avatars/2_uuid.jpg"
}
```

## File Validation

All upload endpoints validate:

- **File type**: Must be an image (checked via MIME type)
- **File extension**: Must be jpg, jpeg, png, or webp
- **File size**:
  - User avatars: max 5MB
  - Plant images: max 10MB
  - Diagnosis images: max 10MB

## Testing with Postman

### 1. Get JWT Token

First, login to get a token:

```
POST http://localhost:8000/api/v1/auth/login
Body: {
  "username": "your-username",
  "password": "your-password"
}
```

Copy the `access_token` from response.

### 2. Upload Image

```
POST http://localhost:8000/api/v1/uploads/diagnosis/image
Authorization: Bearer <paste-token-here>
Body: form-data
  - Key: file (select "File" type)
  - Value: Choose an image file
```

### 3. Verify Upload

- Check response for `image_url`
- Open URL in browser to see the uploaded image
- Check Supabase dashboard → Storage to see the file

## Implementation Details

### Storage Service (`app/services/storage_service.py`)

- Handles all Supabase Storage operations
- Uses async executor pattern to wrap synchronous Supabase SDK
- Generates unique filenames with UUIDs
- Organizes files in user-specific folders
- Returns public URLs for uploaded files

### Key Features

- **Async/Await Support**: Properly handles async FastAPI endpoints with sync Supabase SDK
- **UUID Filenames**: Prevents naming conflicts and duplicate uploads
- **User Organization**: Groups files by user ID for easy management
- **Public URLs**: Returns direct URLs for displaying images in frontend
- **Error Handling**: Comprehensive logging and error messages

## Frontend Integration (React Native/Expo)

### Example: Upload Image from Camera/Gallery

```typescript
import * as ImagePicker from "expo-image-picker";

async function uploadDiagnosisImage(imageUri: string, token: string) {
  // Create form data
  const formData = new FormData();
  formData.append("file", {
    uri: imageUri,
    type: "image/jpeg",
    name: "diagnosis.jpg",
  } as any);

  // Upload to backend
  const response = await fetch(
    "http://your-backend/api/v1/uploads/diagnosis/image",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    }
  );

  const data = await response.json();
  return data.image_url; // Use this URL in your diagnosis record
}

// Usage
const result = await ImagePicker.launchCameraAsync();
if (!result.canceled) {
  const imageUrl = await uploadDiagnosisImage(result.assets[0].uri, userToken);
  // Now create diagnosis with imageUrl
}
```

## Troubleshooting

### Error: "Supabase credentials not configured"

- Check `.env` file has `SUPABASE_URL` and `SUPABASE_KEY`
- Verify `docker-compose.yml` passes environment variables
- Restart with `docker-compose down && docker-compose up -d` (not just `restart`)

### Error: "new row violates row-level security policy"

- RLS policies are blocking uploads
- Go to Supabase dashboard → Storage → Bucket → Policies
- Either disable RLS or add policy with `true` definition and all operations checked

### Error: "SSL/TLS alert bad record mac"

- Fixed by using async executor pattern in storage service
- The synchronous Supabase SDK is now properly wrapped for async FastAPI

### Upload succeeds but image not visible

- Check bucket is set to **public** in Supabase
- Verify URL format: `https://project.supabase.co/storage/v1/object/public/bucket-name/...`
- Test URL directly in browser

### File too large error

- User avatars: max 5MB
- Plant/diagnosis images: max 10MB
- Compress images before upload in frontend if needed

## Security Considerations

### Current Setup (Development)

- Public buckets with `true` RLS policy
- Anyone can upload/download (controlled by JWT authentication in backend)
- Suitable for development and testing

### Production Recommendations

1. **Tighten RLS Policies**: Use user authentication checks

   ```sql
   -- Example: Only allow users to upload their own files
   bucket_id = 'diagnosis-images' AND
   auth.uid()::text = (storage.foldername(name))[1]
   ```

2. **Use Service Role Key**: For backend operations, use `SUPABASE_SERVICE_ROLE_KEY` instead of anon key

3. **Add Upload Limits**: Rate limiting on upload endpoints

4. **Image Validation**: Validate image content (not just extension)

5. **CDN/Optimization**: Use Supabase's image transformation for thumbnails

## Benefits Over External URLs (Pexels)

✅ **Control**: Full ownership of uploaded images  
✅ **Persistence**: Images don't disappear when external service changes  
✅ **Privacy**: User data stays in your storage  
✅ **Performance**: Optimized delivery with Supabase CDN  
✅ **Features**: Image transformations, resizing, thumbnails  
✅ **Scalability**: Handles millions of images with proper organization

## Next Steps

1. ✅ **Backend Setup Complete** - Supabase Storage is fully integrated
2. 🔄 **Frontend Integration** - Add image upload to mobile app
3. 🔄 **Update Database** - Save image URLs to plant/diagnosis/user records
4. 🔄 **Image Display** - Show uploaded images in app UI
5. 🔄 **Image Management** - Add delete/update functionality if needed

## Resources

- [Supabase Storage Documentation](https://supabase.com/docs/guides/storage)
- [Supabase Python Client](https://github.com/supabase-community/supabase-py)
- [FastAPI File Uploads](https://fastapi.tiangolo.com/tutorial/request-files/)
- [Expo ImagePicker](https://docs.expo.dev/versions/latest/sdk/imagepicker/)
