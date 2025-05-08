import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const dataPath = path.join(__dirname, "../data/animals.json");


router.get("/", (req, res) => {
  try {
    const animals = JSON.parse(fs.readFileSync(dataPath));
    res.json(animals);
  } catch (err) {
    console.error("Failed to load animals:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});


router.get("/:id", (req, res) => {
  try {
    const animals = JSON.parse(fs.readFileSync(dataPath));
    const animal = animals.find((a) => a.id === req.params.id);

    if (!animal) return res.status(404).send("Animal not found");
    res.json(animal);
  } catch (err) {
    console.error("Failed to load animal:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});


router.post("/", authMiddleware, (req, res) => {
  try {
    const animals = JSON.parse(fs.readFileSync(dataPath));
    const { name, scientificName, about, images, videos, events } = req.body;

    if (!name || !scientificName || !about || !Array.isArray(images) || images.length === 0) {
      return res.status(400).json({ message: "Invalid request body" });
    }

    if (events && !Array.isArray(events)) {
      return res.status(400).json({ message: "Events must be an array" });
    }
    if (events) {
      for (const event of events) {
        if (!event.name || !event.date || !event.url) {
          return res.status(400).json({ message: "Each event must have name, date, and url" });
        }
      }
    }

    const newAnimal = {
      id: Date.now().toString(),
      name,
      scientificName,
      about,
      images,
      videos: videos || [],
      events: events || [],
      creator: req.user.name
    };

    animals.push(newAnimal);
    fs.writeFileSync(dataPath, JSON.stringify(animals, null, 2));
    res.status(201).json(newAnimal);

  } catch (err) {
    console.error("Failed to create animal:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
