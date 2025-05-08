import fs from "fs";
import path from "path";
import crypto from "crypto";
import { fileURLToPath } from "url";
import { dirname } from "path";


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


export function findUserByCredentials(username, password) {
  try {
    const users = JSON.parse(fs.readFileSync(path.join(__dirname, "../data/users.json")));
    const hash = crypto.createHash("sha256").update(password).digest("hex");
    return users.find((u) => u.name === username && u.hash === hash);
  } catch (err) {
    console.error("Error reading users.json:", err);
    return null;
  }
}
