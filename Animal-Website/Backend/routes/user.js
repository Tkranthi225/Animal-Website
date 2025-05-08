import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


router.get("/profile", authMiddleware, (req, res) => {
  try {
    const animals = JSON.parse(fs.readFileSync(path.join(__dirname, "../data/animals.json")));
    const userAnimals = animals.filter((a) => a.creator === req.user.name);

    res.json({
      name: req.user.name,
      animals: userAnimals
    });
  } catch (err) {
    console.error("Failed to load user profile:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});


export default router;
