import NewsletterSubscriber from '../models/NewsletterSubscriber.js';
import { sendMail, templates } from '../services/emailService.js';

export const subscribe = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email is required' });

    const existing = await NewsletterSubscriber.findOne({ email: email.toLowerCase() });
    if (existing) {
      if (!existing.isActive) {
        existing.isActive = true;
        await existing.save();
      }
      return res.json({ message: 'You are subscribed to the FilatoCo newsletter.' });
    }

    await NewsletterSubscriber.create({ email });
    sendMail({ to: email, subject: 'Welcome to FilatoCo', html: templates.newsletterConfirmation() }).catch(() => {});

    res.status(201).json({ message: 'Subscribed successfully' });
  } catch (err) {
    next(err);
  }
};

export const getSubscribers = async (req, res, next) => {
  try {
    const subscribers = await NewsletterSubscriber.find().sort('-createdAt');
    res.json({ subscribers });
  } catch (err) {
    next(err);
  }
};

export const unsubscribe = async (req, res, next) => {
  try {
    await NewsletterSubscriber.findOneAndUpdate({ email: req.params.email.toLowerCase() }, { isActive: false });
    res.json({ message: 'Unsubscribed' });
  } catch (err) {
    next(err);
  }
};
