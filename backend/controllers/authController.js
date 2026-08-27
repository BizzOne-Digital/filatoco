import crypto from 'crypto';
import User from '../models/User.js';
import PasswordResetToken from '../models/PasswordResetToken.js';
import { generateToken, setTokenCookie } from '../utils/generateToken.js';
import { sendMail, templates } from '../services/emailService.js';

export const register = async (req, res, next) => {
  try {
    const { firstName, lastName, email, phone, password } = req.body;
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ message: 'All required fields must be provided' });
    }
    if (password.length < 8) {
      return res.status(400).json({ message: 'Password must be at least 8 characters' });
    }
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) return res.status(409).json({ message: 'An account with this email already exists' });

    const user = await User.create({ firstName, lastName, email, phone, password });
    const token = generateToken(user._id);
    setTokenCookie(res, token);

    res.status(201).json({
      user: { id: user._id, firstName, lastName, email: user.email, role: user.role },
      token,
    });
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email and password required' });

    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    if (!user.isActive) return res.status(403).json({ message: 'Account is disabled' });

    user.lastLoginAt = new Date();
    await user.save();

    const token = generateToken(user._id);
    setTokenCookie(res, token);

    res.json({
      user: { id: user._id, firstName: user.firstName, lastName: user.lastName, email: user.email, role: user.role },
      token,
    });
  } catch (err) {
    next(err);
  }
};

export const logout = async (req, res) => {
  const isProd = process.env.NODE_ENV === 'production';
  res.clearCookie('token', { httpOnly: true, secure: isProd, sameSite: isProd ? 'none' : 'lax' });
  res.json({ message: 'Logged out' });
};

export const getMe = async (req, res) => {
  res.json({ user: req.user });
};

export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email: (email || '').toLowerCase() });
    if (!user) return res.json({ message: 'If that account exists, a reset email has been sent.' });

    const rawToken = crypto.randomBytes(32).toString('hex');
    const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');
    await PasswordResetToken.deleteMany({ user: user._id });
    await PasswordResetToken.create({
      user: user._id,
      tokenHash,
      expiresAt: new Date(Date.now() + 60 * 60 * 1000),
    });

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${rawToken}`;
    await sendMail({ to: user.email, subject: 'Reset Your FilatoCo Password', html: templates.passwordReset(resetUrl) });

    res.json({ message: 'If that account exists, a reset email has been sent.' });
  } catch (err) {
    next(err);
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    const { token, password } = req.body;
    if (!token || !password || password.length < 8) {
      return res.status(400).json({ message: 'Invalid request' });
    }
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
    const record = await PasswordResetToken.findOne({ tokenHash, expiresAt: { $gt: new Date() } });
    if (!record) return res.status(400).json({ message: 'Reset link is invalid or expired' });

    const user = await User.findById(record.user);
    if (!user) return res.status(400).json({ message: 'Reset link is invalid or expired' });

    user.password = password;
    await user.save();
    await PasswordResetToken.deleteMany({ user: user._id });

    res.json({ message: 'Password reset successful. You can now log in.' });
  } catch (err) {
    next(err);
  }
};
