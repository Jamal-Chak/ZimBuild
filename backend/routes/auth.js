const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const authController = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');
const validation = require('../middleware/validation');

// Validation rules
const registerValidation = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  body('role')
    .optional()
    .isIn(['admin', 'manager', 'editor', 'viewer'])
    .withMessage('Invalid role'),
  body('department')
    .optional()
    .isIn(['management', 'construction', 'design', 'hr', 'marketing'])
    .withMessage('Invalid department')
];

const loginValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

// Routes
router.post(
  '/register',
  registerValidation,
  validation.validate,
  authController.register
);

router.post(
  '/login',
  loginValidation,
  validation.validate,
  authController.login
);

router.get(
  '/profile',
  authenticate,
  authController.getProfile
);

router.patch(
  '/profile',
  authenticate,
  [
    body('name')
      .optional()
      .trim()
      .isLength({ min: 2, max: 100 })
      .withMessage('Name must be between 2 and 100 characters'),
    body('phone')
      .optional()
      .trim()
      .isMobilePhone()
      .withMessage('Please provide a valid phone number')
  ],
  validation.validate,
  authController.updateProfile
);

module.exports = router;