import express from "express";
import path from "path";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { createServer as createViteServer } from "vite";
import fs from "fs";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const upload = multer({ dest: "/tmp/uploads/" });

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Make sure upload dir exists
  if (!fs.existsSync('/tmp/uploads')) {
    fs.mkdirSync('/tmp/uploads', { recursive: true });
  }

  // API endpoints
  app.post("/api/upload", upload.single("file"), async (req, res) => {
    try {
      if (!req.file) {
         res.status(400).json({ error: "No file uploaded" });
         return;
      }
      
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "portfolio-media",
      });

      // Cleanup local file
      fs.unlinkSync(req.file.path);

      res.json({ url: result.secure_url, name: result.original_filename, fullPath: result.public_id });
    } catch (error: any) {
      console.error("Cloudinary upload error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  app.delete("/api/upload", express.json(), async (req, res) => {
    try {
      const { public_id } = req.body;
      if (!public_id) {
         res.status(400).json({ error: "No public_id provided" });
         return;
      }
      await cloudinary.uploader.destroy(public_id);
      res.json({ success: true });
    } catch (error: any) {
      console.error("Cloudinary delete error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/media", async (req, res) => {
    try {
      const result = await cloudinary.search.expression('folder:portfolio-media').sort_by('created_at', 'desc').max_results(30).execute();
      res.json(result.resources.map((r: any) => ({
         url: r.secure_url,
         name: r.filename,
         public_id: r.public_id
      })));
    } catch (error: any) {
      console.error("Cloudinary list error:", error);
      res.status(500).json({ error: error.message });
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
