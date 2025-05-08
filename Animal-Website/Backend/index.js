import express from "express";
import cors from "cors";

import { authMiddleware } from "./middleware/authMiddleware.js";
import authRoutes from "./routes/auth.js";
import animalRoutes from "./routes/animal.js";
import userRoutes from "./routes/user.js";

const app = express();
const port = 3000;


app.use(cors());
app.use(express.json());


app.use("/login", authRoutes);
app.use("/animals", animalRoutes);
app.use("/user", userRoutes); 


app.use((err, req, res, next) => {
  console.error("Global Error:", err.stack);
  res.status(500).json({ message: "Something broke!" });
});


app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});
