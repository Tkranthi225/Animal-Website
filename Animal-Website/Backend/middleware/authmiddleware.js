import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


export function authMiddleware(req, res, next) {
  const token = req.headers.authorization;
  if (!token) return res.status(401).send("Missing auth token");

  try {
    const users = JSON.parse(fs.readFileSync(path.join(__dirname, "../data/users.json")));
    const user = users.find((u) => u.hash === token);

    if (!user) return res.status(401).send("Invalid token");

    req.user = user;
    next();
  } catch (err) {
    console.error("Failed to validate user:", err);
    res.status(500).json({ message: "Internal server error" });
  }
}
