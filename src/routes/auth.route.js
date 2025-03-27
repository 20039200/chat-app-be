import express from "express";
import { checkAuth, getPublicKeyByUserId, googleSignInUp, logout } from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/google-sign-in-up", googleSignInUp);
router.post("/logout", logout);

router.get("/check", protectRoute, checkAuth);

router.get("/:userId/publicKey", protectRoute, getPublicKeyByUserId);

export default router;
