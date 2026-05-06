import express from "express";
import axios from "axios";
import cors from "cors";

// Vercel Serverless Function entry point
const app = express();

app.use(cors());

// API route for Image Proxy
app.get("/api/photos/view/:driveId", async (req, res) => {
  try {
    const { driveId } = req.params;
    if (!driveId) {
      return res.status(400).send("Missing driveId");
    }

    // Drive URL to fetch the image view
    const url = `https://drive.google.com/uc?export=view&id=${driveId}`;

    const response = await axios({
      method: "GET",
      url,
      responseType: "stream",
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
      }
    });

    // Forward headers like content-type
    const contentType = response.headers["content-type"];
    if (contentType) {
      res.set("Content-Type", contentType.toString());
    }
    res.set("Cache-Control", "public, max-age=31536000");

    if (req.query.download) {
      let filename = "photo.jpg";
      if (typeof req.query.filename === "string" && req.query.filename.trim() !== "") {
        filename = req.query.filename.replace(/[^a-zA-Z0-9_\-\. ]/g, "");
        if (!filename.toLowerCase().endsWith(".jpg") && !filename.toLowerCase().endsWith(".png")) {
          filename += ".jpg";
        }
      }
      res.set("Content-Disposition", `attachment; filename="${filename}"`);
    }

    response.data.pipe(res);
  } catch (error: any) {
    console.error("Image Proxy Error:", error.message);
    res.status(500).send("Error fetching image from Google Drive");
  }
});

export default app;
