const ffmpeg = require("fluent-ffmpeg");
const fs = require("fs");
const { Video } = require("./models");

const uploadVideo = async (req, res) => {
  const { originalname, filename, size, path: filepath } = req.file;
  console.log(originalname, size, filepath);

  ffmpeg.ffprobe(filepath, async (err, metadata) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ error: "Could not analyze video" });
    }
    const duration = metadata.format.duration;

    const video = await Video.create({
      name: originalname,
      path: filepath,
      size,
      duration,
      status: "uploaded",
    });

    res.json(video);
  });
};

const trimVideo = async (req, res) => {
  const { id } = req.params;
  const { start, end } = req.body;
  const video = await Video.findByPk(id);

  if (!video) return res.status(404).json({ error: "Video not found" });

  const trimmedPath = `outputs/trimmed_${video.id}.mp4`;
  ffmpeg(video.path)
    .setStartTime(start)
    .setDuration(end - start)
    .output(trimmedPath)
    .on("end", async () => {
      video.trimmedPath = trimmedPath;
      await video.save();
      res.json({ message: "Video trimmed", trimmedPath });
    })
    .on("error", (err) => res.status(500).json({ error: err.message }))
    .run();
};

const addSubtitles = async (req, res) => {
  const { id } = req.params;
  const { text, start, end } = req.body;
  const video = await Video.findByPk(id);
  if (!video) return res.status(404).json({ error: "Video not found" });

  const subtitleFile = `subtitles_${video.id}.ass`;
  const subtitleContent = `
  [Script Info]
  ScriptType: v4.00+
  
  [V4+ Styles]
  Format: Name, Fontname, Fontsize, PrimaryColour, BackColour, OutlineColour, ShadowColour, Bold, Italic, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
  Style: Default,Arial,20,&H00FFFFFF,&H00000000,&H00000000,&H00000000,-1,0,1,1,0,2,10,10,10,1
  
  [Events]
  Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
  Dialogue: 0,${start},${end},Default,,0,0,0,,${text}
    `;
  fs.writeFileSync(subtitleFile, subtitleContent);

  const subtitlePath = `outputs/subtitled_${video.id}.mp4`;
  ffmpeg(video.path)
    .outputOptions("-vf", `ass=${subtitleFile}`)
    .output(subtitlePath)
    .on("end", async () => {
      video.subtitlePath = subtitlePath;
      await video.save();
      res.json({ message: "Subtitles added", subtitlePath });
    })
    .on("error", (err) => res.status(500).json({ error: err.message }))
    .run();
};

const renderVideo = async (req, res) => {
  const { id } = req.params;
  const video = await Video.findByPk(id);
  if (!video) return res.status(404).json({ error: "Video not found" });

  const finalPath = `outputs/final_${video.id}.mp4`;

  ffmpeg(video.subtitlePath || video.trimmedPath || video.path)
    .output(finalPath)
    .on("end", async () => {
      video.finalPath = finalPath;
      video.status = "rendered";
      await video.save();
      res.json({ message: "Final video rendered", finalPath });
    })
    .on("error", (err) => res.status(500).json({ error: err.message }))
    .run();
};

const downloadVideo = async (req, res) => {
  const { id } = req.params;
  const video = await Video.findByPk(id);
  if (!video || !video.finalPath) return res.status(404).json({ error: "Final video not available" });

  res.download(video.finalPath);
};

module.exports = { uploadVideo, trimVideo, addSubtitles, renderVideo, downloadVideo };
