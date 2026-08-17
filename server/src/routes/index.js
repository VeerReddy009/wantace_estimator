import { Router } from "express";
import { login } from "../controllers/authController.js";
import { getAdminConfig, getAdminLeads, updateAdminConfig } from "../controllers/adminController.js";
import { createEstimate, getPublicConfig } from "../controllers/publicController.js";
import { requireOwnerAuth } from "../middleware/requireOwnerAuth.js";

const router = Router();

router.get("/health", (_req, res) => {
  res.json({ ok: true });
});

router.get("/config", getPublicConfig);
router.post("/estimate", createEstimate);
router.post("/auth/login", login);

router.get("/admin/config", requireOwnerAuth, getAdminConfig);
router.put("/admin/config", requireOwnerAuth, updateAdminConfig);
router.get("/admin/leads", requireOwnerAuth, getAdminLeads);

export default router;
