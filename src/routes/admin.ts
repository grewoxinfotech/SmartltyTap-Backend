import { Router } from "express";
import { pool } from "../db/mysql";

const router = Router();

router.get("/dashboard", async (_req, res) => {
  const [[orders]] = await pool.query("SELECT COUNT(*) as totalOrders, IFNULL(SUM(amount),0) as revenue FROM orders");
  const [[users]] = await pool.query("SELECT COUNT(*) as activeUsers FROM users WHERE is_active=1");
  const [[cards]] = await pool.query("SELECT COUNT(*) as totalCardsIssued FROM cards");
  const [activity] = await pool.query("SELECT message, created_at FROM activity_log ORDER BY created_at DESC LIMIT 10");
  res.json({ ...(orders as any), ...(users as any), ...(cards as any), recentActivity: activity });
});

export default router;

