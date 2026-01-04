import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
    const header = req.headers.authorization ?? "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : null;

    if (!token) return res.status(401).json({ message: "Missing token" });

    try {
        jwt.verify(token, process.env.JWT_SECRET ?? "dev-secret-change-me");
        next();
    } catch {
        return res.status(401).json({ message: "Invalid token" });
    }
}
