import express from "express";
import fs from "fs";
import path from "path";
import crypto from "crypto";
import { fileURLToPath } from "url";
import { dirname } from "path";

const router = express.Router();


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


router.post("/", (req, res) => {
  try {
    const { username, password } = req.body;
    const users = JSON.parse(fs.readFileSync(path.join(__dirname, "../data/users.json")));

    const hash = crypto.createHash("sha256").update(password).digest("hex");
    const user = users.find((u) => u.name === username && u.hash === hash);

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    res.json({ token: user.hash });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});


export default router;
