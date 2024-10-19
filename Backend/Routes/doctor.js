import {
  updateDoctor,
  deleteDoctor,
  getAllDoctor,
  getSingleDoctor,
} from "../Controllers/doctorController.js";
import express from "express";
import { authenticate, restrict } from "../auth/verifyToken.js";
import reviewRoute from "../Routes/review.js";

const router = express.Router();

//nested Routes
router.use("/:doctorId/reviews", reviewRoute);

router.get("/:id", getSingleDoctor);
router.get("/", getAllDoctor);
router.get("/:id", authenticate, restrict(["doctor"]), updateDoctor);
router.get("/:id", authenticate, restrict(["doctor"]), deleteDoctor);

export default router;
