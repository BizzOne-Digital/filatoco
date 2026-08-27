import express from 'express';
import { protect, adminOnly } from '../middleware/auth.js';
import { submitAppointment, getAppointments, updateAppointmentStatus } from '../controllers/appointmentController.js';

const router = express.Router();

router.post('/', submitAppointment);
router.get('/', protect, adminOnly, getAppointments);
router.put('/:id/status', protect, adminOnly, updateAppointmentStatus);

export default router;
