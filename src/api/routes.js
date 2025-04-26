const express = require("express");
const router = express.Router();
const { uploadVideo, trimVideo, addSubtitles, renderVideo, downloadVideo } = require("./controllers");
const multer = require("multer");

const upload = multer({ dest: "uploads/" });

// Upload Video
router.post("/videos/upload", upload.single("video"), uploadVideo);

// Trim Video
router.post("/videos/:id/trim", trimVideo);

// Add Subtitles
router.post("/videos/:id/subtitles", addSubtitles);

// Render Final Video
router.post("/videos/:id/render", renderVideo);

// Download Final Video
router.get("/videos/:id/download", downloadVideo);

module.exports = router;
