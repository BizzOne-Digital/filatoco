import Contact from '../models/Contact.js';
import { sendMail, templates } from '../services/emailService.js';

export const submitContact = async (req, res, next) => {
  try {
    const { fullName, email, phone, subject, message } = req.body;
    if (!fullName || !email || !message) return res.status(400).json({ message: 'Name, email and message are required' });

    const contact = await Contact.create({ fullName, email, phone, subject, message });

    sendMail({ to: process.env.ADMIN_EMAIL, subject: `New Contact: ${subject || fullName}`, html: templates.contactNotification(contact) }).catch(() => {});
    sendMail({ to: email, subject: 'Thank You for Contacting FilatoCo', html: templates.contactConfirmation(contact) }).catch(() => {});

    res.status(201).json({ message: 'Message sent successfully' });
  } catch (err) {
    next(err);
  }
};

export const getContacts = async (req, res, next) => {
  try {
    const contacts = await Contact.find().sort('-createdAt');
    res.json({ contacts });
  } catch (err) {
    next(err);
  }
};

export const markContactRead = async (req, res, next) => {
  try {
    const contact = await Contact.findByIdAndUpdate(req.params.id, { isRead: true }, { new: true });
    res.json({ contact });
  } catch (err) {
    next(err);
  }
};

export const deleteContact = async (req, res, next) => {
  try {
    await Contact.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) {
    next(err);
  }
};
