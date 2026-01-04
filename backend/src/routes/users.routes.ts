import { Router } from "express";
import { z } from "zod";
import { authMiddleware } from "../middleware/auth.middleware";
import { users, type User } from "../data/users.db";

const router = Router();
router.use(authMiddleware);

router.get("/", (_req, res) => res.json(users));

router.post("/", (req, res) => {
    const schema = z.object({
        name: z.string().min(2),
        email: z.string().email()
    });

    const parsed = schema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ message: "Invalid payload" });

    const newUser: User = { id: Date.now(), ...parsed.data };
    users.unshift(newUser);
    return res.status(201).json(newUser);
});

router.put("/:id", (req, res) => {
    const id = Number(req.params.id);

    const schema = z.object({
        name: z.string().min(2),
        email: z.string().email()
    });

    const parsed = schema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ message: "Invalid payload" });

    const idx = users.findIndex(u => u.id === id);
    if (idx === -1) return res.status(404).json({ message: "Not found" });

    users[idx] = { ...users[idx], ...parsed.data };
    return res.json(users[idx]);
});

router.delete("/:id", (req, res) => {
    const id = Number(req.params.id);
    const idx = users.findIndex(u => u.id === id);
    if (idx === -1) return res.status(404).json({ message: "Not found" });

    users.splice(idx, 1);
    return res.status(204).end();
});

export default router;
