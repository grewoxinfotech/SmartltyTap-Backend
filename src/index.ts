import express from "express";
import cors from "cors";
import { env } from "./config/env";
import adminRouter from "./routes/admin";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => res.json({ ok: true }));
app.use("/api/admin", adminRouter);

app.listen(env.port, () => {
  // eslint-disable-next-line no-console
  console.log(`Admin API running on http://localhost:${env.port}`);
});

