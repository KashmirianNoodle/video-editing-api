require("dotenv").config();
const express = require("express");

const app = express();
app.use(express.json());

const videoRoutes = require("./src/api/routes");

app.use("/api", videoRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = { app };
