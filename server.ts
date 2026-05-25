import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import axios from "axios";
import { HttpsProxyAgent } from "https-proxy-agent";
import cors from "cors";

// Optional: if user configures a proxy URL in their server environment
const PROXY_URL = process.env.PROXY_URL || "";
let httpsAgent: HttpsProxyAgent<string> | undefined;

if (PROXY_URL) {
  httpsAgent = new HttpsProxyAgent(PROXY_URL);
  console.log("Using proxy agent for Google Drive requests");
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());

  // API route for Image Proxy
  app.get("/api/photos/view/:driveId", async (req, res) => {
    try {
      const { driveId } = req.params;
      if (!driveId) {
        return res.status(400).send("Missing driveId");
      }

      // Drive URL to fetch the image view
      let url = `https://drive.google.com/uc?export=view&id=${driveId}`;
      if (req.query.w) {
        url = `https://drive.google.com/thumbnail?id=${driveId}&sz=w${req.query.w}`;
      }

      const response = await axios({
        method: "GET",
        url,
        responseType: "stream",
        httpsAgent,
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

  // API route for Folder Listing (publicly shared folders)
  app.get("/api/photos/list-folder/:folderId", async (req, res) => {
    try {
      const { folderId } = req.params;
      if (!folderId) return res.status(400).send("Missing folderId");

      // We use the embedded folder view which contains file metadata in JSON format within the HTML
      const url = `https://drive.google.com/embeddedfolderview?id=${folderId}`;
      
      const response = await axios.get(url, {
        httpsAgent,
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
        }
      });

      const html = response.data;
      // The folder contents are often embedded in a "folder-contents" JSON-like structure
      // We'll use a regex to find all file IDs and titles that look like images
      // A common pattern in the embedded view source is: ["ID","TITLE",...]
      
      const domMatches = html.matchAll(/id="entry-([a-zA-Z0-9-_]{25,})"[\s\S]*?<div class="flip-entry-title">([^<]+)<\/div>/g);
      let files: { id: string, name: string }[] = [];
      const seenIds = new Set<string>();

      for (const match of domMatches) {
        const id = match[1];
        const name = match[2];
        if (!seenIds.has(id)) {
          files.push({ id, name });
          seenIds.add(id);
        }
      }

      // If DOM regex didn't find anything, try the JSON format as fallback
      if (files.length === 0) {
        const fileMatches = html.matchAll(/\["([a-zA-Z0-9-_]{25,})","([^"]+)"/g);
        for (const match of fileMatches) {
          const id = match[1];
          const name = match[2];
          if (!seenIds.has(id)) {
            files.push({ id, name });
            seenIds.add(id);
          }
        }
      }
      
      // Filter images
      files = files.filter(f => /\.(jpg|jpeg|png|gif|webp|bmp)$/i.test(f.name));

      res.json({ files });
    } catch (error: any) {
      console.error("Folder List Error:", error.message);
      res.status(500).send("Error listing items from folder");
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
