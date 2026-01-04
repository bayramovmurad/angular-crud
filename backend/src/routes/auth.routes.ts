import { Router } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { z } from "zod";
import type { LoginRequest, LoginResponse } from "../types/auth.types.ts";

const router = Router();

// Demo user: admin@example.com / password123
const DEMO_EMAIL = "admin@example.com";
const DEMO_HASH = bcrypt.hashSync("password123", 10);

router.post("/login", async (req, res) => {
    const schema = z.object({
        email: z.string().email(),
        password: z.string().min(6)
    });

    const parsed = schema.safeParse(req.body as LoginRequest);
    if (!parsed.success) return res.status(400).json({ message: "Invalid payload" });

    const { email, password } = parsed.data;

    if (email !== DEMO_EMAIL) return res.status(401).json({ message: "Invalid credentials" });

    const ok = await bcrypt.compare(password, DEMO_HASH);
    if (!ok) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign(
        { email },
        process.env.JWT_SECRET ?? "dev-secret-change-me",
        { expiresIn: "1h" }
    );

    const response: LoginResponse = { token, user: { email } };
    return res.json(response);
});

export default router;
