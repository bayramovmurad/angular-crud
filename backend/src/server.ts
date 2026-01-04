import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.routes";
import usersRoutes from "./routes/users.routes";

dotenv.config();

const app = express();

app.use(cors({ origin: "http://localhost:4200" }));
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/users", usersRoutes);

const port = Number(process.env.PORT ?? 3001);
app.listen(port, () => {
    console.log(`API running on http://localhost:${port}`);
});
