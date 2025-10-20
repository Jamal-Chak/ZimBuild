const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const contactController = require('../controllers/contactController');
const validation = require('../middleware/validation');
const upload = require('../middleware/upload'); // This now imports the multer instance directly

// Validation rules
const contactValidation = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('phone')
    .optional()
    .isMobilePhone()
    .withMessage('Please provide a valid phone number'),
  body('subject')
    .trim()
    .isLength({ min: 5, max: 200 })
    .withMessage('Subject must be between 5 and 200 characters'),
  body('message')
    .trim()
    .isLength({ min: 10, max: 2000 })
    .withMessage('Message must be between 10 and 2000 characters')
];

const careerValidation = [
  body('fullName')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Full name must be between 2 and 100 characters'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('phone')
    .isMobilePhone()
    .withMessage('Please provide a valid phone number'),
  body('position')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Position must be between 2 and 100 characters'),
  body('experience')
    .isIn(['0-2', '3-5', '6-10', '10+'])
    .withMessage('Please select valid experience range'),
  body('coverLetter')
    .optional()
    .trim()
    .isLength({ max: 5000 })
    .withMessage('Cover letter must not exceed 5000 characters')
];

// Routes
router.post(
  '/inquiry',
  contactValidation,
  validation.validate,
  contactController.submitInquiry
);

router.post(
  '/career',
  upload.single('resume'), // This should work now
  careerValidation,
  validation.validate,
  contactController.submitCareerApplication
);

router.post(
  '/newsletter',
  [
    body('email')
      .isEmail()
      .normalizeEmail()
      .withMessage('Please provide a valid email')
  ],
  validation.validate,
  contactController.subscribeToNewsletter
);

router.get(
  '/inquiries',
  contactController.getAllInquiries
);

router.get(
  '/inquiries/:id',
  contactController.getInquiry
);

router.patch(
  '/inquiries/:id/status',
  [
    body('status')
      .isIn(['new', 'contacted', 'in-progress', 'resolved', 'spam'])
      .withMessage('Invalid status')
  ],
  validation.validate,
  contactController.updateInquiryStatus
);

module.exports = router;