import Appointment from '../models/Appointment.js';
import { sendMail, templates } from '../services/emailService.js';

export const submitAppointment = async (req, res, next) => {
  try {
    const { name, email, phone, preferredDate, message } = req.body;
    if (!name || !email) return res.status(400).json({ message: 'Name and email are required' });

    const appointment = await Appointment.create({ name, email, phone, preferredDate, message });
    sendMail({ to: process.env.ADMIN_EMAIL, subject: `New Appointment Request from ${name}`, html: templates.appointmentNotification(appointment) }).catch(() => {});

    res.status(201).json({ message: 'Appointment request submitted' });
  } catch (err) {
    next(err);
  }
};

export const getAppointments = async (req, res, next) => {
  try {
    const appointments = await Appointment.find().sort('-createdAt');
    res.json({ appointments });
  } catch (err) {
    next(err);
  }
};

export const updateAppointmentStatus = async (req, res, next) => {
  try {
    const appointment = await Appointment.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    res.json({ appointment });
  } catch (err) {
    next(err);
  }
};
