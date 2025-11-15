# Plant Addition & Diagnosis Flow - AI-Powered (Backend Focus)

Complete guide for adding plants with AI identification and diagnosing plant health using Claude Vision API.

---

## 📋 Table of Contents

1. [Backend Flow Only](#backend-flow-only)
2. [What You Need to Do (Backend Setup)](#what-you-need-to-do)
3. [Full Flow: Frontend + Backend](#full-flow-frontend-backend)
4. [API Reference](#api-reference)
5. [Testing Guide](#testing-guide)

---

# Backend Flow Only

## 🎯 Four Backend Endpoints

```
1. POST /api/v1/plants/identify          → AI identifies species
2. POST /api/v1/plants                    → Create plant record
3. POST /api/v1/uploads/plant/{id}/image → Upload & save image to Supabase
4. POST /api/v1/plants/diagnose          → AI diagnoses plant health
```

---

## Endpoint 1: AI Plant Identification

**Endpoint:** `POST /api/v1/plants/identify`

**Authentication:** JWT Bearer token required

**Request:**

```http
POST /api/v1/plants/identify
Authorization: Bearer eyJhbGc...
Content-Type: multipart/form-data

file: [image file]
```

**Backend Process:**

```python
1. Validate JWT token → Get current_user
2. Validate file:
   - Must be image/* content type
   - Max size 10MB
3. Read file content → Convert to base64
4. Call Claude AI Vision API:
   - Model: claude-sonnet-4-5-20250929 (Claude 4.5 Sonnet)
   - Temperature: 0 (deterministic responses)
   - Prompt: Acts as professional botanist, returns ALL species attributes
5. AI returns complete species data (8 fields):
   - scientific_name (standardized binomial nomenclature)
   - common_name
   - watering_frequency_days (integer)
   - sunlight_hours_needed (integer)
   - sunlight_type (enum: "indirect", "bright indirect", etc.)
   - humidity_preference (enum: "low", "medium", "high")
   - temperature_min (integer, Celsius)
   - care_difficulty (enum: "easy", "medium", "hard")
6. Normalize scientific name: Capitalize genus, lowercase species
7. Search database: species = get_species_by_name(scientific_name)
8. If species NOT found:
   - Create new species with ALL AI-provided data
   - Scientific names are unique - prevents duplicates
9. Return species_id for plant creation
```

**Response:**

```json
{
  "scientific_name": "Rudbeckia hirta",
  "common_name": "Black-eyed Susan",
  "species_id": 13
}
```

**Files Involved:**

- `/app/api/v1/endpoints/plant_identification.py` - Endpoint handler
- `/app/services/ai_service.py` - Claude AI integration
- `/app/services/plant_species_service.py` - Species lookup/creation
- `/app/repositories/plant_species_repository.py` - Database queries

**Database Changes:**

- May create new row in `plant_species` table with complete care data if species doesn't exist

---

## Endpoint 2: Create Plant Record

**Endpoint:** `POST /api/v1/plants`

**Authentication:** JWT Bearer token required

**Request:**

```http
POST /api/v1/plants
Authorization: Bearer eyJhbGc...
Content-Type: application/json

{
  "species_id": 13,
  "plant_name": "Sunny",
  "location": "Garden",
  "acquired_date": "2024-01-15T00:00:00Z",
  "last_watered": "2024-01-20T10:30:00Z"
}
```

**Note:** `plant_name` is user's personal nickname (e.g., "Sunny", "Buddy", "Green Monster")

**Backend Process:**

```python
1. Validate JWT token → Get current_user
2. Validate request body against PlantCreate schema
3. Verify species_id exists in database
4. Create plant record:
   - user_id = current_user.id
   - species_id = from request
   - plant_name, location, dates = from request
   - image_url = None (will be added in next step)
5. Save to database
6. Eager load species relationship
7. Return plant with full species details
```

**Response:**

```json
{
  "id": 16,
  "user_id": 5,
  "species_id": 13,
  "plant_name": "Sunny",
  "location": "Garden",
  "last_watered": "2024-01-20T10:30:00Z",
  "acquired_date": "2024-01-15T00:00:00Z",
  "image_url": null,
  "species": {
    "id": 13,
    "scientific_name": "Rudbeckia hirta",
    "common_name": "Black-eyed Susan",
    "care_difficulty": "easy",
    "watering_frequency_days": 7,
    "sunlight_hours_needed": 6.0,
    "sunlight_type": "bright direct",
    "humidity_preference": "medium",
    "temperature_min": 10.0
    "common_name": "Peace Lily",
    "scientific_name": "Spathiphyllum wallisii",
    "care_level": "Easy",
    ...
  }
}
```

**Files Involved:**

- `/app/api/v1/endpoints/plants.py` - Endpoint handler
- `/app/services/plant_service.py` - Business logic
- `/app/repositories/plant_repository.py` - Database operations
- `/app/schemas/plant_schema.py` - Request/response validation

**Database Changes:**

- Creates new row in `plants` table with `image_url = NULL`

---

## Endpoint 3: Upload Plant Image

**Endpoint:** `POST /api/v1/uploads/plant/{plant_id}/image`

**Authentication:** JWT Bearer token required

**Request:**

```http
POST /api/v1/uploads/plant/456/image
Authorization: Bearer eyJhbGc...
Content-Type: multipart/form-data

file: [image file]
```

**Backend Process:**

```python
1. Validate JWT token → Get current_user
2. Validate file:
   - Must be image/* content type
   - Max size 10MB
   - Allowed extensions: jpg, jpeg, png, webp
3. Verify plant exists and belongs to current_user:
   - plant = get_plant_by_id(plant_id, user_id)
   - If not found → 404 error
4. Generate unique filename:
   - Format: {user_id}/plant_{plant_id}_{uuid}.{extension}
5. Upload to Supabase Storage:
   - Bucket: plant-images
   - Use async executor pattern for sync SDK
6. Get public URL from Supabase
7. Update plant.image_url in database:
   - update_plant(plant_id, user_id, PlantUpdate(image_url=url))
8. Return image URL
```

**Response:**

```json
{
  "image_url": "https://lzallbdxznmiaubdirsv.supabase.co/storage/v1/object/public/plant-images/789/plant_456_abc123.jpg"
}
```

**Files Involved:**

- `/app/api/v1/endpoints/uploads.py` - Endpoint handler
- `/app/services/storage_service.py` - Supabase Storage integration
- `/app/services/plant_service.py` - Database update

**Database Changes:**

- Updates `plants.image_url` to Supabase public URL

**Supabase Storage:**

- Creates file in `plant-images` bucket
- Path: `{user_id}/plant_{plant_id}_{uuid}.jpg`
- Public read access (RLS policy: `true`)

---

## Backend Data Flow Summary

```
┌─────────────────────────────────────────────────────────────┐
│                    BACKEND DATA FLOW                        │
└─────────────────────────────────────────────────────────────┘

Step 1: AI Identification
─────────────────────────
Request: Image file
   ↓
[JWT Validation] → current_user.id
   ↓
[File Validation] → Valid image
   ↓
[Claude AI] → Plant identification
   ↓
[Database: plant_species]
   ├─ Search by scientific_name
   ├─ If NOT found → CREATE species
   └─ Get species_id
   ↓
Response: species_id + plant info


Step 2: Create Plant
────────────────────
Request: species_id + plant details
   ↓
[JWT Validation] → current_user.id
   ↓
[Schema Validation] → Valid PlantCreate
   ↓
[Database: plant_species]
   └─ Verify species_id exists
   ↓
[Database: plants]
   └─ INSERT new plant (image_url = NULL)
   ↓
Response: plant_id + full plant object


Step 3: Upload Image
────────────────────
Request: plant_id + image file
   ↓
[JWT Validation] → current_user.id
   ↓
[Database: plants]
   └─ Verify plant exists AND user owns it
   ↓
[Supabase Storage]
   └─ Upload to plant-images bucket
   ↓
[Database: plants]
   └─ UPDATE image_url
   ↓
Response: image_url


Step 4: Diagnose Plant Health
──────────────────────────────
Request: Image file
   ↓
[JWT Validation] → current_user.id
   ↓
[File Validation] → Valid image
   ↓
[Claude AI] → Health diagnosis
   ↓
Response: Complete diagnosis (8 fields)
   ├─ issue_detected
   ├─ confidence_score
   ├─ severity
   ├─ recommendation
   ├─ recovery_watering
   ├─ recovery_sunlight
   ├─ recovery_air_circulation
   └─ recovery_temperature

NOTE: Diagnosis NOT saved to database
      (Frontend can save if user wants)
```

---

# What You Need to Do

## Backend Setup Checklist

### ✅ Already Completed

- [x] AI service with Claude integration (`ai_service.py`)
- [x] Plant identification endpoint (`plant_identification.py`)
- [x] Species auto-creation logic
- [x] Plant creation endpoint (`plants.py`)
- [x] Image upload endpoint (`uploads.py`)
- [x] Plant diagnosis endpoint (`plant_diagnosis.py`)
- [x] Diagnosis AI service (`diagnosis_ai_service.py`)
- [x] Supabase Storage integration (`storage_service.py`)
- [x] All database models and schemas
- [x] JWT authentication
- [x] Error handling

### 🔧 Required Configuration

**1. Add Anthropic API Key**

Get API key from: https://console.anthropic.com/

Add to `.env` file:

```bash
ANTHROPIC_API_KEY=sk-ant-api03-xxxxxxxxxxxxx
```

**2. Install Dependencies**

```bash
cd back-end
pip install anthropic==0.42.0
```

Or rebuild Docker:

```bash
docker-compose down
docker-compose up -d --build
```

**3. Restart Backend**

```bash
docker-compose restart backend
```

**4. Verify Configuration**

Check environment variables are loaded:

```bash
docker exec -it plantsense_api env | grep ANTHROPIC
```

Should show:

```
ANTHROPIC_API_KEY=sk-ant-api03-xxxxxxxxxxxxx
```

### 🧪 Test Backend Endpoints

**Test 1: AI Identification**

```bash
# Login first
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"password"}'

# Get JWT token from response, then:
curl -X POST http://localhost:8000/api/v1/plants/identify \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "file=@/path/to/plant_photo.jpg"
```

Expected response:

```json
{
  "scientific_name": "Rudbeckia hirta",
  "common_name": "Black-eyed Susan",
  "species_id": 13
}
```

**Test 2: Create Plant**

```bash
curl -X POST http://localhost:8000/api/v1/plants \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "species_id": 13,
    "plant_name": "Sunny",
    "location": "Garden",
    "acquired_date": "2024-01-15T00:00:00Z",
    "last_watered": "2024-01-20T10:00:00Z"
  }'
```

Expected response:

```json
{
  "id": 16,
  "user_id": 5,
  "species_id": 13,
  "plant_name": "Sunny",
  "image_url": null,
  ...
}
```

**Test 3: Upload Image**

```bash
curl -X POST http://localhost:8000/api/v1/uploads/plant/16/image \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "file=@/path/to/plant_photo.jpg"
```

Expected response:

```json
{
  "image_url": "https://lzallbdxznmiaubdirsv.supabase.co/storage/v1/object/public/plant-images/5/plant_16_xyz.jpg"
}
```

**Test 4: Diagnose Plant Health**

```bash
curl -X POST http://localhost:8000/api/v1/plants/diagnose \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "file=@/path/to/plant_photo.jpg"
```

Expected response (sick plant):

```json
{
  "issue_detected": "Leaf Spot Disease",
  "confidence_score": 0.87,
  "severity": "Medium Severity",
  "recommendation": "Remove affected leaves immediately to prevent spread. Reduce watering frequency and ensure proper air circulation. Apply a fungicide spray every 7-10 days for 3 weeks. Keep the plant in a well-ventilated area and avoid getting water on the leaves.",
  "recovery_watering": "Reduce to once every 5-7 days",
  "recovery_sunlight": "Indirect bright light, 4-6 hours",
  "recovery_air_circulation": "Ensure good ventilation",
  "recovery_temperature": "Keep between 18-24°C"
}
```

Expected response (healthy plant):

```json
{
  "issue_detected": "No Issues Detected",
  "confidence_score": 0.96,
  "severity": "Healthy",
  "recommendation": "Excellent! Your plant is in outstanding health with vibrant foliage and strong growth. The leaves show no signs of disease, pest damage, or stress. Continue your current care routine including regular watering and proper light exposure to maintain this excellent condition.",
  "recovery_watering": "Water when top inch is dry",
  "recovery_sunlight": "Bright indirect light, 6-8 hours",
  "recovery_air_circulation": "Good room ventilation",
  "recovery_temperature": "Keep between 18-24°C"
}
```

**Test 5: Verify Complete Plant**

```bash
curl -X GET http://localhost:8000/api/v1/plants/16 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

Expected response:

```json
{
  "id": 16,
  "image_url": "https://...",  ← Should be populated now
  "species": {
    "common_name": "Black-eyed Susan",
    "scientific_name": "Rudbeckia hirta"
  },
  ...
}
```

---

# Full Flow: Frontend + Backend

## Complete User Journey

### Step 1: User Opens Add Plant Screen

**User Action:** Taps "Add Plant" button

**Frontend:**

- Navigate to add plant screen
- Show two options:
  - 📷 Take Photo
  - 📁 Upload Photo
- No backend call

**Backend:**

- Nothing happens

---

### Step 2: User Selects/Takes Photo

**User Action:** Takes photo with camera OR selects from gallery

**Frontend:**

```javascript
// Using React Native or Expo
import * as ImagePicker from "expo-image-picker";

// Option 1: Camera
const takePhoto = async () => {
  const result = await ImagePicker.launchCameraAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    quality: 0.8,
  });
  if (!result.canceled) {
    setPhotoUri(result.assets[0].uri);
  }
};

// Option 2: Gallery
const pickPhoto = async () => {
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    quality: 0.8,
  });
  if (!result.canceled) {
    setPhotoUri(result.assets[0].uri);
  }
};
```

**Backend:**

- Nothing happens (photo stored locally)

---

### Step 3: AI Identifies Plant (API CALL #1)

**Frontend:**

```javascript
const identifyPlant = async (photoUri) => {
  setLoading(true);
  setLoadingMessage("Identifying plant with AI...");

  const formData = new FormData();
  formData.append("file", {
    uri: photoUri,
    type: "image/jpeg",
    name: "plant.jpg",
  });

  try {
    const response = await fetch(
      "http://localhost:8000/api/v1/plants/identify/plant",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error("Failed to identify plant");
    }

    const data = await response.json();

    // Save AI results
    setSpeciesId(data.species_id);
    setScientificName(data.scientific_name);
    setCommonName(data.common_name);

    setLoading(false);
    showToast(`Identified: ${data.common_name}! 🌱`);

    // Navigate to form
    navigateToPlantForm();
  } catch (error) {
    setLoading(false);
    showError("Could not identify plant. Try a clearer photo.");
  }
};
```

**Backend:** (Already explained above in "Endpoint 1")

---

### Step 4: User Reviews & Fills Form

**Frontend:**

```javascript
<View>
  <Image source={{ uri: photoUri }} style={styles.thumbnail} />

  <Text style={styles.label}>Plant Identified!</Text>

  {/* AI Results (Read-only) */}
  <Card>
    <Text style={styles.commonName}>{commonName}</Text>
    <Text style={styles.scientificName}>{scientificName}</Text>
  </Card>

  {/* User Input - Plant Nickname */}
  <TextInput
    label="Give your plant a name *"
    value={plantName}
    onChangeText={setPlantName}
    placeholder="e.g., Charlie, Buddy, Green Monster"
  />

  {/* Required Fields */}
  <Picker
    label="Location *"
    selectedValue={location}
    onValueChange={setLocation}
  >
    <Picker.Item label="Living Room" value="Living Room" />
    <Picker.Item label="Bedroom" value="Bedroom" />
    <Picker.Item label="Kitchen" value="Kitchen" />
    <Picker.Item label="Office" value="Office" />
    <Picker.Item label="Balcony" value="Balcony" />
  </Picker>

  <DatePicker
    label="Date Acquired *"
    value={acquiredDate}
    onChange={setAcquiredDate}
  />

  <DatePicker
    label="Last Watered *"
    value={lastWatered}
    onChange={setLastWatered}
  />

  <Button onPress={handleAddPlant}>Add Plant</Button>
</View>
```

**What User Sees:**

- ✅ **Species info** (from AI, read-only in card: "Peace Lily - Spathiphyllum wallisii")
- 📝 **Plant name** (user types personal nickname like "Charlie")
- 📝 **Location** (user must select, REQUIRED)
- 📝 **Acquired date** (user must pick, REQUIRED)
- 📝 **Last watered** (user must pick, REQUIRED)

**Backend:**

- Nothing happens (user filling form)

---

### Step 5: Create Plant (API CALL #2)

### Step 5: Create Plant (API CALL #2)

**Frontend:**

```javascript
const handleAddPlant = async () => {
  // Validate required fields
  if (!plantName || !location || !acquiredDate || !lastWatered) {
    showError("Please fill in all required fields");
    return;
  }

  setLoading(true);
  setLoadingMessage("Creating plant...");

  const plantData = {
    species_id: speciesId, // From Step 3 (AI)
    plant_name: plantName, // User's personal nickname
    location: location, // User filled (REQUIRED)
    acquired_date: acquiredDate.toISOString(), // User filled (REQUIRED)
    last_watered: lastWatered.toISOString(), // User filled (REQUIRED)
  };

  try {
    const response = await fetch("http://localhost:8000/api/v1/plants", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${userToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(plantData),
    });

    if (!response.ok) {
      throw new Error("Failed to create plant");
    }

    const createdPlant = await response.json();
    const plantId = createdPlant.id;

    // Save plant ID for next step
    setPlantId(plantId);

    // Now upload image
    await uploadPlantImage(plantId, photoUri);
  } catch (error) {
    setLoading(false);
    showError("Failed to create plant");
  }
};
```

**Backend:** (Already explained above in "Endpoint 2")

---

### Step 6: Upload Image (API CALL #3)

**Frontend:**

```javascript
const uploadPlantImage = async (plantId, photoUri) => {
  setLoadingMessage("Uploading photo...");

  const formData = new FormData();
  formData.append("file", {
    uri: photoUri,
    type: "image/jpeg",
    name: "plant.jpg",
  });

  try {
    const response = await fetch(
      `http://localhost:8000/api/v1/uploads/plant/${plantId}/image`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
        body: formData,
      }
    );

    if (!response.ok) {
      // Plant is already created, just image failed
      throw new Error("Image upload failed");
    }

    const result = await response.json();

    setLoading(false);
    showToast("Plant added successfully! 🎉");

    // Navigate to plant detail or garden
    navigation.navigate("PlantDetail", { plantId });
  } catch (error) {
    setLoading(false);
    // Don't show as critical error since plant is already created
    showWarning("Plant added, but photo upload failed. You can add it later.");
    navigation.navigate("PlantDetail", { plantId });
  }
};
```

**Backend:** (Already explained above in "Endpoint 3")

---

### Step 7: Done! ✅

**Frontend:**

- Shows success message
- Navigates to plant detail page
- Plant appears in user's garden collection

**Backend:**

- Plant fully stored in database with image
- Ready to be retrieved via GET endpoints

**Database State:**

```sql
-- plants table
id: 456
user_id: 789
species_id: 123
plant_name: "Monstera Deliciosa"  -- From AI, user didn't edit
location: "Living Room"            -- User filled
acquired_date: 2024-01-15          -- User filled
last_watered: 2024-01-20           -- User filled
image_url: "https://supabase.co/storage/.../plant_456.jpg"

-- plant_species table
id: 123
common_name: "Monstera Deliciosa"
scientific_name: "Monstera deliciosa"
care_level: "Easy"
```

**Supabase Storage:**

```
Bucket: plant-images
File: 789/plant_456_abc123.jpg
Public URL: https://lzallbdxznmiaubdirsv.supabase.co/storage/v1/object/public/plant-images/789/plant_456_abc123.jpg
```

---

## Endpoint 4: AI Plant Health Diagnosis

**Endpoint:** `POST /api/v1/plants/diagnose`

**Authentication:** JWT Bearer token required

**Request:**

```http
POST /api/v1/plants/diagnose
Authorization: Bearer eyJhbGc...
Content-Type: multipart/form-data

file: [image file]
```

**Backend Process:**

```python
1. Validate JWT token → Get current_user
2. Validate file:
   - Must be image/* content type
   - Max size 10MB
3. Read file content → Convert to base64
4. Call Claude AI Vision API:
   - Model: claude-sonnet-4-5-20250929 (Claude 4.5 Sonnet)
   - Temperature: 0 (deterministic responses)
   - Prompt: Acts as "expert plant pathologist and botanist"
5. AI returns complete diagnosis (8 fields):
   - issue_detected (e.g., "Leaf Spot Disease" or "No Issues Detected")
   - confidence_score (0.0-1.0, e.g., 0.87 = 87%)
   - severity ("Healthy", "Low Severity", "Medium Severity", "High Severity")
   - recommendation (detailed 3-5 sentence explanation)
   - recovery_watering (short tip, max 8-10 words)
   - recovery_sunlight (short tip, max 8-10 words)
   - recovery_air_circulation (short tip, max 8-10 words)
  - recovery_temperature (short tip, max 8-10 words, MUST use degrees Celsius)
6. Return diagnosis (does NOT save to database automatically)
```

**Response (Sick Plant):**

```json
{
  "issue_detected": "Leaf Spot Disease",
  "confidence_score": 0.87,
  "severity": "Medium Severity",
  "recommendation": "Remove affected leaves immediately to prevent spread. Reduce watering frequency and ensure proper air circulation. Apply a fungicide spray every 7-10 days for 3 weeks. Keep the plant in a well-ventilated area and avoid getting water on the leaves.",
  "recovery_watering": "Reduce to once every 5-7 days",
  "recovery_sunlight": "Indirect bright light, 4-6 hours",
  "recovery_air_circulation": "Ensure good ventilation",
  "recovery_temperature": "Keep between 18-24°C"
}
```

**Response (Healthy Plant):**

```json
{
  "issue_detected": "No Issues Detected",
  "confidence_score": 0.96,
  "severity": "Healthy",
  "recommendation": "Excellent! Your plant is in outstanding health with vibrant foliage and strong growth. The leaves show no signs of disease, pest damage, or stress. Continue your current care routine including regular watering and proper light exposure to maintain this excellent condition.",
  "recovery_watering": "Water when top inch is dry",
  "recovery_sunlight": "Bright indirect light, 6-8 hours",
  "recovery_air_circulation": "Good room ventilation",
  "recovery_temperature": "Keep between 18-24°C"
}
```

**Files Involved:**

- `/app/api/v1/endpoints/plant_diagnosis.py` - Endpoint handler
- `/app/services/diagnosis_ai_service.py` - Claude AI integration for diagnosis
- `/app/schemas/plant_schema.py` - PlantDiagnosisResponse validation

**Database Changes:**

- **NONE** - Diagnosis is returned to user but NOT saved automatically
- Frontend can optionally save diagnosis results if user wants history

**Key Differences from Identification:**

| Feature          | Identification           | Diagnosis                      |
| ---------------- | ------------------------ | ------------------------------ |
| Purpose          | Determine species        | Analyze plant health           |
| Auto-saves to DB | ✅ Yes (creates species) | ❌ No (just returns diagnosis) |
| AI Role          | Professional botanist    | Plant pathologist              |
| Returns          | species_id + basic info  | 8 diagnostic fields            |
| Use Case         | Adding new plant         | Checking existing plant        |

---

## Flow Diagram: Frontend ↔ Backend

```
┌──────────────────────────────────────────────────────────────────┐
│                    FRONTEND + BACKEND FLOW                       │
└──────────────────────────────────────────────────────────────────┘

FRONTEND                          BACKEND                    DATABASE
────────────────────────────────────────────────────────────────────

1. User taps "Add Plant"
   - Show camera/gallery options

2. User takes/selects photo
   - Save to local state (photoUri)

3. Show loading: "Identifying..."
   Upload photo  ─────────────→  POST /plants/identify/plant
                                  - Validate JWT
                                  - Validate image
                                  - Convert to base64
                                  - Call Claude AI
                                  - Parse response
                                  - Check species exists ──→  SELECT * FROM plant_species
                                  - If not found ──────────→  INSERT INTO plant_species
                                  - Get species_id ←───────  RETURN species
                 ←─────────────  Response: species_id + info

4. Store AI results:
   - species_id
   - plant_name (from common_name)
   - scientific_name
   - care_level
   - description

5. Show form with:
   - Species info (read-only card)
   - Plant name (pre-filled, editable)
   - Location, dates, notes (user fills)

6. User fills form:
   - plant_name (edit if wanted)
   - location ✓ REQUIRED
   - acquired_date ✓ REQUIRED
   - last_watered ✓ REQUIRED

7. User taps "Add Plant"
   Show loading: "Creating plant..."
   Submit data  ──────────────→  POST /plants
                                  - Validate JWT
                                  - Validate data
                                  - Check species exists ──→  SELECT * FROM plant_species
                                  - Create plant ──────────→  INSERT INTO plants
                                                              (image_url = NULL)
                 ←─────────────  Response: plant_id

8. Store plant_id
   Show loading: "Uploading photo..."
   Upload image ──────────────→  POST /uploads/plant/{id}/image
                                  - Validate JWT
                                  - Check plant ownership ──→  SELECT * FROM plants
                                  - Upload to Supabase
                                  - Get public URL
                                  - Update plant ──────────→  UPDATE plants
                                                              SET image_url = '...'
                 ←─────────────  Response: image_url

9. Show success!
   Navigate to plant detail

✅ COMPLETE                      ✅ COMPLETE                ✅ COMPLETE
Plant in collection              All data saved             All records updated
```

---

# API Reference

## Endpoint 1: Identify Plant

```http
POST /api/v1/plants/identify
Authorization: Bearer {jwt_token}
Content-Type: multipart/form-data

file: [binary image data]
```

**Success Response (200):**

```json
{
  "scientific_name": "Rudbeckia hirta",
  "common_name": "Black-eyed Susan",
  "species_id": 13
}
```

**Error Responses:**

- `400` - Invalid file format or file too large
- `401` - Unauthorized (invalid/missing JWT)
- `500` - AI service error

---

## Endpoint 2: Create Plant

```http
POST /api/v1/plants
Authorization: Bearer {jwt_token}
Content-Type: application/json

{
  "species_id": 123,
  "plant_name": "Monstera Deliciosa",
  "location": "Living Room",
  "acquired_date": "2024-01-15T00:00:00Z",
  "last_watered": "2024-01-20T10:30:00Z",
  "notes": "Birthday gift"
}
```

**Success Response (200):**

```json
{
  "id": 456,
  "user_id": 789,
  "species_id": 123,
  "plant_name": "Monstera Deliciosa",
  "location": "Living Room",
  "acquired_date": "2024-01-15T00:00:00Z",
  "last_watered": "2024-01-20T10:30:00Z",
  "notes": "Birthday gift",
  "image_url": null,
  "species": {
    "id": 123,
    "common_name": "Monstera Deliciosa",
    "scientific_name": "Monstera deliciosa",
    "care_level": "Easy",
    ...
  }
}
```

**Error Responses:**

- `400` - Validation error (missing required fields)
- `401` - Unauthorized (invalid/missing JWT)
- `404` - Species not found

---

## Endpoint 3: Upload Plant Image

```http
POST /api/v1/uploads/plant/{plant_id}/image
Authorization: Bearer {jwt_token}
Content-Type: multipart/form-data

file: [binary image data]
```

**Success Response (200):**

```json
{
  "image_url": "https://lzallbdxznmiaubdirsv.supabase.co/storage/v1/object/public/plant-images/789/plant_456_abc123.jpg"
}
```

**Error Responses:**

- `400` - Invalid file format or file too large
- `401` - Unauthorized (invalid/missing JWT)
- `404` - Plant not found or not owned by user

---

## Endpoint 4: Diagnose Plant Health

```http
POST /api/v1/plants/diagnose
Authorization: Bearer {jwt_token}
Content-Type: multipart/form-data

file: [binary image data]
```

**Success Response (200) - Sick Plant:**

```json
{
  "issue_detected": "Leaf Spot Disease",
  "confidence_score": 0.87,
  "severity": "Medium Severity",
  "recommendation": "Remove affected leaves immediately to prevent spread. Reduce watering frequency and ensure proper air circulation. Apply a fungicide spray every 7-10 days for 3 weeks. Keep the plant in a well-ventilated area and avoid getting water on the leaves.",
  "recovery_watering": "Reduce to once every 5-7 days",
  "recovery_sunlight": "Indirect bright light, 4-6 hours",
  "recovery_air_circulation": "Ensure good ventilation",
  "recovery_temperature": "Keep between 18-24°C"
}
```

**Success Response (200) - Healthy Plant:**

```json
{
  "issue_detected": "No Issues Detected",
  "confidence_score": 0.96,
  "severity": "Healthy",
  "recommendation": "Excellent! Your plant is in outstanding health with vibrant foliage and strong growth. The leaves show no signs of disease, pest damage, or stress. Continue your current care routine including regular watering and proper light exposure to maintain this excellent condition.",
  "recovery_watering": "Water when top inch is dry",
  "recovery_sunlight": "Bright indirect light, 6-8 hours",
  "recovery_air_circulation": "Good room ventilation",
  "recovery_temperature": "Keep between 18-24°C"
}
```

\*\*Error Responses:

- `400` - Invalid file format or file too large
- `401` - Unauthorized (invalid/missing JWT)
- `500` - AI service error

**Note:** Diagnosis results are NOT saved to database automatically. Frontend can save if user wants history.

---

# Testing Guide

## Manual Testing with Postman/Insomnia

### 1. Login to Get JWT Token

```http
POST http://localhost:8000/api/v1/auth/login
Content-Type: application/json

{
  "username": "testuser",
  "password": "password123"
}
```

**Response:**

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "user_id": 1,
  "username": "testuser"
}
```

Copy the `access_token` for next steps.

---

### 2. Test AI Identification

```http
POST http://localhost:8000/api/v1/plants/identify/plant
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: multipart/form-data

file: [Select a plant photo]
```

**Expected Response:**

```json
{
  "common_name": "Snake Plant",
  "scientific_name": "Sansevieria trifasciata",
  "care_level": "Easy",
  "description": "Hardy succulent with upright leaves...",
  "species_id": 5,
  "species_exists": false
}
```

📝 **Note the `species_id` for next step!**

---

### 3. Test Create Plant

```http
POST http://localhost:8000/api/v1/plants
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "species_id": 5,
  "plant_name": "Snake Plant",
  "location": "Bedroom",
  "acquired_date": "2024-01-15T00:00:00Z",
  "last_watered": "2024-01-20T10:00:00Z"
}
```

**Expected Response:**

```json
{
  "id": 10,
  "user_id": 1,
  "species_id": 5,
  "plant_name": "Snake Plant",
  "location": "Bedroom",
  "image_url": null,
  "species": {
    "common_name": "Snake Plant",
    "scientific_name": "Sansevieria trifasciata"
  },
  ...
}
```

📝 **Note the `id` (plant_id) for next step!**

---

### 4. Test Upload Image

```http
POST http://localhost:8000/api/v1/uploads/plant/10/image
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: multipart/form-data

file: [Same plant photo from step 2]
```

**Expected Response:**

```json
{
  "image_url": "https://lzallbdxznmiaubdirsv.supabase.co/storage/v1/object/public/plant-images/1/plant_10_xyz.jpg"
}
```

---

### 5. Verify Complete Plant

```http
GET http://localhost:8000/api/v1/plants/10
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Expected Response:**

```json
{
  "id": 10,
  "user_id": 1,
  "species_id": 5,
  "plant_name": "Snake Plant",
  "nickname": "Snakey",
  "location": "Bedroom",
  "image_url": "https://lzallbdxznmiaubdirsv.supabase.co/storage/.../plant_10_xyz.jpg",  ← ✅ NOW POPULATED
  "species": {
    "id": 5,
    "common_name": "Snake Plant",
    "scientific_name": "Sansevieria trifasciata",
    "care_level": "Easy"
  },
  ...
}
```

✅ **Success! Plant is fully created with image!**

---

## Testing with cURL

### Complete test sequence:

```bash
# 1. Login
TOKEN=$(curl -s -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"password123"}' \
  | jq -r '.access_token')

echo "Token: $TOKEN"

# 2. Identify plant
SPECIES_ID=$(curl -s -X POST http://localhost:8000/api/v1/plants/identify \
  -H "Authorization: Bearer $TOKEN" \
  -F "file=@/path/to/plant_photo.jpg" \
  | jq -r '.species_id')

echo "Species ID: $SPECIES_ID"

# 3. Create plant
PLANT_ID=$(curl -s -X POST http://localhost:8000/api/v1/plants \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"species_id\": $SPECIES_ID,
    \"plant_name\": \"Sunny\",
    \"location\": \"Garden\",
    \"acquired_date\": \"2024-01-15T00:00:00Z\",
    \"last_watered\": \"2024-01-20T10:00:00Z\"
  }" \
  | jq -r '.id')

echo "Plant ID: $PLANT_ID"

# 4. Upload image
curl -X POST http://localhost:8000/api/v1/uploads/plant/$PLANT_ID/image \
  -H "Authorization: Bearer $TOKEN" \
  -F "file=@/path/to/plant_photo.jpg"

# 5. Diagnose plant health
curl -X POST http://localhost:8000/api/v1/plants/diagnose \
  -H "Authorization: Bearer $TOKEN" \
  -F "file=@/path/to/plant_photo.jpg" \
  | jq

# 6. Verify
curl -X GET http://localhost:8000/api/v1/plants/$PLANT_ID \
  -H "Authorization: Bearer $TOKEN" \
  | jq
```

---

## Troubleshooting

### Error: "ANTHROPIC_API_KEY not configured"

**Solution:**

```bash
# Add to .env file
echo "ANTHROPIC_API_KEY=sk-ant-api03-xxxxx" >> .env

# Rebuild container
docker-compose down
docker-compose up -d --build
```

### Error: "Species not found"

**Cause:** species_id from Step 1 doesn't exist

**Solution:** Run identification endpoint again or check database

### Error: "Plant not found or you don't own it"

**Cause:** Wrong plant_id or plant belongs to different user

**Solution:** Verify plant_id from Step 2, check JWT token is correct

### Error: "File too large (max 10MB)"

**Solution:** Compress image before uploading

### Image Upload Fails but Plant Created

**This is OK!** Plant is already saved. User can:

- Retry upload later
- Edit plant and add image
- Leave without image (optional)

---

## Summary

### Backend: What's Already Done ✅

- ✅ AI identification endpoint (Claude Vision API)
- ✅ Plant creation endpoint
- ✅ Image upload endpoint (Supabase Storage)
- ✅ Plant diagnosis endpoint (Claude Vision API)
- ✅ Species auto-creation
- ✅ JWT authentication
- ✅ Error handling
- ✅ Database models & schemas

### Backend: What You Need to Do 🔧

1. Add `ANTHROPIC_API_KEY` to `.env`
2. Install `anthropic` package
3. Restart backend container
4. Test all 4 endpoints with Postman

### Frontend: What Needs to Be Built 📱

1. Camera/photo picker UI
2. API calls to 4 endpoints:
   - Identify plant → get species_id
   - Create plant → get plant_id
   - Upload image → link image to plant
   - Diagnose plant → get health analysis
3. Form for user input:
   - Plant name (user's personal nickname, required)
   - Location (dropdown, required)
   - Acquired date (date picker, required)
   - Last watered (date picker, required)
4. Diagnosis results UI:
   - Severity badge at top
   - Issue name as title
   - Confidence score with progress bar
   - Recommendation text (long)
   - 4 recovery tips with icons (short, 8-10 words each)
5. Loading states
6. Error handling
7. Success navigation

### Key Points 🎯

- **4 AI-powered endpoints:** Identify, Create, Upload, Diagnose
- **2 photos uploaded:** Once for AI identification, once for storage (can be same photo)
- **AI identification:** Provides species_id + care info, auto-creates species if needed
- **AI diagnosis:** Provides health analysis, does NOT save to database (frontend can save if user wants)
- **User fills:** Plant name (personal nickname), location, acquired date, last watered (all required)
- **Recovery tips:** SHORT (8-10 words), recommendation is LONG (3-5 sentences)
- **Separation of concerns:** AI first, user input second, image upload last
- **Error resilience:** Plant can exist without image
- **User control:** Can see species info before creating plant
  type: 'image/jpeg',
  name: 'plant.jpg'
  });

// Call identification endpoint
const response = await fetch('http://localhost:8000/api/v1/plants/identify/plant', {
method: 'POST',
headers: {
'Authorization': `Bearer ${userToken}`
},
body: formData
});

const aiResult = await response.json();

````

#### Backend Process:
```python
# 1. Validate JWT token
current_user = get_current_user(token)

# 2. Validate image file
if not file.content_type.startswith("image/"):
    raise HTTPException(400, "File must be an image")

# 3. Read image and convert to base64
content = await file.read()
image_base64 = base64.b64encode(content).decode('utf-8')

# 4. Call Claude AI
plant_info = await ai_service.identify_plant(image_base64)
# Returns:
# {
#   "common_name": "Monstera Deliciosa",
#   "scientific_name": "Monstera deliciosa",
#   "care_level": "Easy",
#   "description": "Large tropical plant..."
# }

# 5. Check if species exists in database
existing_species = await plant_species_service.get_species_by_name(
    plant_info['scientific_name']
)

# 6. If species doesn't exist, create it
if not existing_species:
    new_species = await plant_species_service.create_species({
        common_name: plant_info['common_name'],
        scientific_name: plant_info['scientific_name'],
        care_level: plant_info['care_level'],
        description: plant_info['description'],
        # Default values for other required fields
        sunlight_needs: "Moderate light",
        watering_frequency: "Water when soil is dry",
        typical_lifespan: "Perennial",
        growth_rate: "Moderate"
    })
    species_id = new_species.id
else:
    species_id = existing_species.id

# 7. Return result
return {
    "common_name": plant_info['common_name'],
    "scientific_name": plant_info['scientific_name'],
    "care_level": plant_info['care_level'],
    "description": plant_info['description'],
    "species_id": species_id,
    "species_exists": True/False
}
````

#### Backend Response:

```json
{
  "common_name": "Monstera Deliciosa",
  "scientific_name": "Monstera deliciosa",
  "care_level": "Easy",
  "description": "A popular tropical houseplant known for its large, glossy leaves with distinctive splits and holes. Native to Central America, it's an easy-care plant that thrives in bright, indirect light.",
  "species_id": 123,
  "species_exists": true
}
```

#### Frontend After Response:

```javascript
// Save AI results
setPlantName(aiResult.common_name);
setSpeciesId(aiResult.species_id);
setCareLeve(aiResult.care_level);
setDescription(aiResult.description);

// Show success message
showToast("Plant identified! 🌱");

// Show form for user to fill
navigateToPlantForm();
```

---

### STEP 4: User Fills Additional Information

**User Action:** Fills out form

**Frontend Shows:**

```
╔══════════════════════════════════════╗
║  Add New Plant                       ║
╠══════════════════════════════════════╣
║                                      ║
║  [Photo Thumbnail]                   ║
║                                      ║
║  Plant Name:                         ║
║  [Monstera Deliciosa] ← Pre-filled   ║
║  (User can edit this)                ║
║                                      ║
║  Species: Monstera deliciosa         ║
║  (AI-identified, read-only)          ║
║                                      ║
║  Care Level: Easy                    ║
║  (AI-identified, read-only)          ║
║                                      ║
║  Nickname (optional):                ║
║  [_________________]                 ║
║                                      ║
║  Location: *                         ║
║  [Living Room ▼]                     ║
║                                      ║
║  Date Acquired: *                    ║
║  [📅 2024-01-15]                     ║
║                                      ║
║  Last Watered: *                     ║
║  [📅 2024-01-20]                     ║
║                                      ║
║  Notes (optional):                   ║
║  [_________________]                 ║
║                                      ║
║      [Cancel]  [Add Plant]           ║
╚══════════════════════════════════════╝
```

**Frontend State:**

```javascript
const [plantData, setPlantData] = useState({
  species_id: 123, // From AI
  plant_name: "Monstera Deliciosa", // From AI (editable)
  nickname: "", // User fills (optional)
  location: "", // User fills (required)
  acquired_date: null, // User fills (required)
  last_watered: null, // User fills (required)
  notes: "", // User fills (optional)
});

const photo = savedPhotoUri; // Keep photo in memory
```

**Backend:**

- Nothing happens (user still filling form)

---

### STEP 5: Create Plant Record (SECOND API CALL)

**User Action:** Taps "Add Plant" button

#### Frontend Request:

```javascript
const plantData = {
  species_id: 123, // From Step 3 (AI)
  plant_name: "Monstera Deliciosa", // From Step 3 (AI)
  nickname: "My First Monstera", // User entered
  location: "Living Room", // User entered
  acquired_date: "2024-01-15T00:00:00Z", // User selected
  last_watered: "2024-01-20T10:30:00Z", // User selected
  notes: "Birthday gift from Mom", // User entered (optional)
  // NOTE: NO image_url yet!
};

const response = await fetch("http://localhost:8000/api/v1/plants", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${userToken}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify(plantData),
});

const createdPlant = await response.json();
// Save plant_id for next step
const plantId = createdPlant.id;
```

#### Backend Process:

```python
# 1. Validate JWT token
current_user = get_current_user(token)

# 2. Validate request data
plant_create = PlantCreate(**request_data)

# 3. Verify species exists
species = await plant_species_service.get_by_id(plant_create.species_id)
if not species:
    raise HTTPException(404, "Species not found")

# 4. Create plant in database
plant = Plant(
    user_id=current_user.id,
    species_id=plant_create.species_id,
    plant_name=plant_create.plant_name,
    nickname=plant_create.nickname,
    location=plant_create.location,
    acquired_date=plant_create.acquired_date,
    last_watered=plant_create.last_watered,
    notes=plant_create.notes,
    image_url=None  # Will be added in next step!
)

db.add(plant)
await db.commit()
await db.refresh(plant)

# 5. Return created plant
return plant
```

#### Backend Response:

```json
{
  "id": 456,
  "user_id": 789,
  "species_id": 123,
  "plant_name": "Monstera Deliciosa",
  "nickname": "My First Monstera",
  "location": "Living Room",
  "acquired_date": "2024-01-15T00:00:00Z",
  "last_watered": "2024-01-20T10:30:00Z",
  "notes": "Birthday gift from Mom",
  "image_url": null,
  "species": {
    "id": 123,
    "common_name": "Monstera Deliciosa",
    "scientific_name": "Monstera deliciosa",
    "care_level": "Easy",
    ...
  }
}
```

#### Frontend After Response:

```javascript
// Save plant ID
const plantId = createdPlant.id; // 456

// Show loading: "Uploading photo..."
// Proceed to Step 6
```

---

### STEP 6: Upload Plant Image (THIRD API CALL)

#### Frontend Request:

```javascript
// Prepare image for upload
const formData = new FormData();
formData.append("file", {
  uri: photoUri, // Same photo from Step 2
  type: "image/jpeg",
  name: "plant.jpg",
});

// Upload image to Supabase
const response = await fetch(
  `http://localhost:8000/api/v1/uploads/plant/${plantId}/image`,
  {
    method: "POST",
    headers: {
      Authorization: `Bearer ${userToken}`,
    },
    body: formData,
  }
);

const uploadResult = await response.json();
// uploadResult.image_url contains Supabase URL
```

#### Backend Process:

```python
# 1. Validate JWT token
current_user = get_current_user(token)

# 2. Validate image file
if not file.content_type.startswith("image/"):
    raise HTTPException(400, "File must be an image")

if len(content) > 10 * 1024 * 1024:
    raise HTTPException(400, "File too large (max 10MB)")

# 3. Check plant exists and belongs to user
plant = await plant_service.get_plant_by_id(plant_id, current_user.id)
if not plant:
    raise HTTPException(404, "Plant not found or you don't own it")

# 4. Upload to Supabase Storage
filename = f"{current_user.id}/plant_{plant_id}_{uuid}.jpg"
image_url = await storage_service.upload_plant_image(
    user_id=current_user.id,
    plant_id=plant_id,
    file=file
)
# Returns: https://lzallbdxznmiaubdirsv.supabase.co/storage/v1/object/public/plant-images/789/plant_456_abc123.jpg

# 5. Update plant.image_url in database
await plant_service.update_plant(
    plant_id=plant_id,
    user_id=current_user.id,
    data=PlantUpdate(image_url=image_url)
)

# 6. Return image URL
return {"image_url": image_url}
```

#### Backend Response:

```json
{
  "image_url": "https://lzallbdxznmiaubdirsv.supabase.co/storage/v1/object/public/plant-images/789/plant_456_abc123.jpg"
}
```

#### Frontend After Response:

```javascript
// Update local state
setPlantImageUrl(uploadResult.image_url);

// Show success
showToast("Plant added successfully! 🎉");

// Navigate to plant detail page or garden view
navigate(`/plants/${plantId}`);
```

---

### STEP 7: Done! ✅

**Database State:**

```sql
-- plants table
id: 456
user_id: 789
species_id: 123
plant_name: "Monstera Deliciosa"
nickname: "My First Monstera"
location: "Living Room"
acquired_date: "2024-01-15"
last_watered: "2024-01-20"
notes: "Birthday gift from Mom"
image_url: "https://lzallbdxznmiaubdirsv.supabase.co/storage/.../plant_456_abc123.jpg"

-- plant_species table (auto-created if new)
id: 123
common_name: "Monstera Deliciosa"
scientific_name: "Monstera deliciosa"
care_level: "Easy"
description: "A popular tropical houseplant..."
```

**Supabase Storage:**

```
Bucket: plant-images
Path: 789/plant_456_abc123.jpg
Size: ~2MB
Public URL: https://...
```

**User's Collection:**

- Plant added ✅
- Photo stored ✅
- AI-identified species ✅
- All details saved ✅

---

## 🔄 Summary: 3 Backend Calls

| Step  | Endpoint                         | Purpose               | Input                    | Output                  |
| ----- | -------------------------------- | --------------------- | ------------------------ | ----------------------- |
| **1** | `POST /plants/identify/plant`    | AI identifies species | Photo file               | species_id + plant info |
| **2** | `POST /plants`                   | Create plant record   | Plant details (no image) | plant_id                |
| **3** | `POST /uploads/plant/{id}/image` | Upload photo          | Photo file + plant_id    | image_url               |

---

## ⚠️ Important Notes

### Why 3 Separate Calls?

1. **Identification First**: User needs to see AI results before confirming
2. **User Input**: User must add location/dates between AI and creation
3. **Image Upload**: Separate because we need plant_id to organize storage

### Alternative: Could we combine them?

**Option A: Single endpoint** (NOT RECOMMENDED)

```
POST /plants/create-with-ai
- Upload photo
- AI identifies
- User provides details in same request
- Create plant + upload image

❌ Problem: Can't show AI results to user first
❌ Problem: What if AI identification fails?
❌ Problem: Complex endpoint, hard to debug
```

**Option B: Two endpoints** (POSSIBLE)

```
1. POST /plants/identify-and-create
   - Upload photo
   - AI identifies
   - Create plant immediately
   - Upload image to Supabase
   - Return plant_id + image_url

2. PATCH /plants/{id}
   - User fills additional info
   - Update plant record

❌ Problem: Creates plant before user confirms
❌ Problem: Orphaned plants if user cancels
```

**Option C: Current (3 endpoints)** ✅ BEST

```
1. Identify → User reviews → User confirms
2. Create plant → No going back
3. Upload image → Complete

✅ User can review AI results
✅ No orphaned data
✅ Clear separation of concerns
✅ Easy to debug
✅ Follows REST principles
```

---

## 🐛 Error Handling

### Step 3: AI Identification Fails

```javascript
try {
  const aiResult = await identifyPlant(photo);
} catch (error) {
  if (error.status === 400) {
    showError("Could not identify plant. Try a clearer photo.");
  } else if (error.status === 401) {
    showError("Please log in again");
    redirectToLogin();
  }
  // Allow user to retry or enter species manually
}
```

### Step 5: Plant Creation Fails

```javascript
try {
  const plant = await createPlant(plantData);
} catch (error) {
  if (error.status === 404) {
    showError("Species not found. Please try identifying again.");
  } else if (error.status === 400) {
    showError("Please fill in all required fields");
  }
}
```

### Step 6: Image Upload Fails

```javascript
try {
  await uploadPlantImage(plantId, photo);
} catch (error) {
  // Plant is already created!
  showError("Plant added, but photo upload failed. You can add it later.");
  // Allow retry or skip
  navigate(`/plants/${plantId}`);
}
```

---

## 📊 Database Schema

```sql
-- Required tables
plant_species (
  id, common_name, scientific_name, care_level,
  description, sunlight_needs, watering_frequency,
  typical_lifespan, growth_rate
)

plants (
  id, user_id, species_id,
  plant_name, nickname, location,
  acquired_date, last_watered,
  image_url, notes
)

users (
  id, username, email, ...
)
```

---

## 🧪 Testing the Complete Flow

### Manual Test (Postman/Insomnia)

**1. Login:**

```
POST http://localhost:8000/api/v1/auth/login
Body: {"username": "testuser", "password": "password"}
Response: {"access_token": "eyJ...", "user_id": 1, "username": "testuser"}
```

**2. Identify Plant:**

```
POST http://localhost:8000/api/v1/plants/identify
Headers: Authorization: Bearer eyJ...
Body: form-data
  file: [Select plant photo]
Response: {
  "scientific_name": "Rudbeckia hirta",
  "common_name": "Black-eyed Susan",
  "species_id": 13
}
```

**3. Create Plant:**

```
POST http://localhost:8000/api/v1/plants
Headers:
  Authorization: Bearer eyJ...
  Content-Type: application/json
Body: {
  "species_id": 5,
  "plant_name": "Snake Plant",
  "location": "Bedroom",
  "acquired_date": "2024-01-15T00:00:00Z",
  "last_watered": "2024-01-20T10:00:00Z",
  "nickname": "Snakey"
}
Response: {
  "id": 10,
  "user_id": 1,
  "species_id": 5,
  ...
}
```

**4. Upload Image:**

```
POST http://localhost:8000/api/v1/uploads/plant/10/image
Headers: Authorization: Bearer eyJ...
Body: form-data
  file: [Same plant photo]
Response: {
  "image_url": "https://lzallbdxznmiaubdirsv.supabase.co/storage/v1/object/public/plant-images/1/plant_10_xyz.jpg"
}
```

**5. Verify:**

```
GET http://localhost:8000/api/v1/plants/10
Headers: Authorization: Bearer eyJ...
Response: {
  "id": 10,
  "image_url": "https://...",  // ✅ Image URL present
  "species": {
    "common_name": "Snake Plant",
    "scientific_name": "Sansevieria trifasciata"
  },
  ...
}
```

---

## ✅ Checklist for Implementation

### Backend (Already Done ✅)

- [x] AI identification endpoint
- [x] Plant creation endpoint
- [x] Image upload endpoint
- [x] Species auto-creation
- [x] All required fields in schemas

### Frontend (To Do)

- [ ] Camera/photo picker integration
- [ ] Call identification endpoint
- [ ] Show AI results to user
- [ ] Plant details form
- [ ] Call create plant endpoint
- [ ] Call upload image endpoint
- [ ] Error handling for each step
- [ ] Loading states
- [ ] Success/failure messages

---

## 🎯 Key Takeaway

**The backend flow is:**

```
Photo → AI Identify (GET species_id)
     → User Fills Form
     → Create Plant (GET plant_id)
     → Upload Image (LINK image to plant)
     → DONE ✅
```

Each step is **independent** and **reversible** until Step 5 (Create Plant).
