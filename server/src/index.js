import "dotenv/config";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import { connectDatabase } from "./config/db.js";
import { ensureSeedConfig } from "./config/seedConfig.js";
import router from "./routes/index.js";

const app = express();
const port = Number(process.env.PORT || 4000);
const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";

app.use(
  cors({
    origin: clientUrl,
    credentials: true,
  })
);
app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());

app.use("/api", router);

app.use((error, _req, res, _next) => {
  console.error(error);
  return res.status(500).json({ error: "Unexpected server error." });
});

async function start() {
  try {
    await connectDatabase();
    await ensureSeedConfig();

    app.listen(port, () => {
      console.log(`Server listening on port ${port}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
}

start();
