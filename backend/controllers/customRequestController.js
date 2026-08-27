import CustomRequest from '../models/CustomRequest.js';
import { uploadBufferToCloudinary } from '../utils/cloudinaryUpload.js';
import { sendMail, templates } from '../services/emailService.js';

export const submitCustomRequest = async (req, res, next) => {
  try {
    const { name, email, phone, bagType, size, colors, materials, budgetRange, description } = req.body;
    if (!name || !email || !description) return res.status(400).json({ message: 'Name, email and description are required' });

    let referenceImage;
    if (req.file) referenceImage = await uploadBufferToCloudinary(req.file.buffer, 'filatoco/custom-requests');

    const request = await CustomRequest.create({
      name, email, phone, bagType, size, colors, materials, budgetRange, description, referenceImage,
    });

    sendMail({ to: process.env.ADMIN_EMAIL, subject: `New Custom Bag Request from ${name}`, html: templates.customRequestNotification(request) }).catch(() => {});

    res.status(201).json({ message: 'Custom request submitted successfully' });
  } catch (err) {
    next(err);
  }
};

export const getCustomRequests = async (req, res, next) => {
  try {
    const requests = await CustomRequest.find().sort('-createdAt');
    res.json({ requests });
  } catch (err) {
    next(err);
  }
};

export const updateCustomRequestStatus = async (req, res, next) => {
  try {
    const request = await CustomRequest.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    res.json({ request });
  } catch (err) {
    next(err);
  }
};
