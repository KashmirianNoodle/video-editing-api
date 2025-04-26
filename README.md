# 🎬 Video Editing Backend

This is a simple Node.js + Express backend for uploading, trimming, adding subtitles, rendering, and downloading videos using FFmpeg.

## 🚀 Features

- Upload videos (via `multer`)
- Trim videos using start and end time
- Add subtitles (ASS format)
- Render the final video (with trims and subtitles)
- Download the final rendered video
- Uses PostgreSQL via Sequelize to store video metadata

---

## 🧾 Requirements

- Node.js (v14+ recommended)
- PostgreSQL
- FFmpeg (must be installed and accessible in system path)

---

## ⚙️ Installation

```bash
git clone https://github.com/yourusername/video-editing-backend.git
cd video-editing-backend
npm install
```

Environment Variables

Create a .env file:

```bash
DB_NAME=mydatabase
DB_USER=postgres
DB_PASS=yourpassword
DB_HOST=localhost
DB_PORT=5432
```
## ▶️ Running the Server

```bash
node index.js
```
The server will start on: http://localhost:3000


## 📁 API Endpoints
### 1. Upload a Video

POST /api/videos/upload

Form-Data:
Key   |	Type	Description
video | File	Video file (.mp4, .mov, etc)

Response:
```bash
{
  "id": 1,
  "name": "sample.mp4",
  "path": "uploads/xyz123",
  "size": 1234567,
  "duration": 12.34,
  "status": "uploaded"
}
```

### 2. Trim a Video

POST /api/videos/:id/trim

Body:
```bash
{
  "start": 5,
  "end": 10
}
```
Response:
```bash
{
  "message": "Video trimmed",
  "trimmedPath": "outputs/trimmed_1.mp4"
}
```

### 3. Add Subtitles

POST /api/videos/:id/subtitles
Body:
```bash
{
  "text": "Hello World!",
  "start": "0:00:02.00",
  "end": "0:00:05.00"
}
```
Response:
```bash
{
  "message": "Subtitles added",
  "subtitlePath": "outputs/subtitled_1.mp4"
}
```

### 4. Render Final Video

POST /api/videos/:id/render

Response:
```bash
{
  "message": "Final video rendered",
  "finalPath": "outputs/final_1.mp4"
}
```

### 5. Download Final Video

GET /api/videos/:id/download
Returns the final video as a downloadable file.