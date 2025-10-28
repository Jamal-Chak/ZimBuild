const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const projectController = require('../controllers/projectController');
const validation = require('../middleware/validation');
const upload = require('../middleware/upload');
const auth = require('../middleware/auth');

// Validation rules
const projectValidation = [
  body('title')
    .trim()
    .isLength({ min: 5, max: 200 })
    .withMessage('Title must be between 5 and 200 characters'),
  body('description')
    .trim()
    .isLength({ min: 10, max: 2000 })
    .withMessage('Description must be between 10 and 2000 characters'),
  body('category')
    .isIn(['commercial', 'residential', 'infrastructure', 'healthcare', 'education', 'other'])
    .withMessage('Invalid category'),
  body('location')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Location must be between 2 and 100 characters'),
  body('status')
    .isIn(['planning', 'in-progress', 'completed', 'on-hold'])
    .withMessage('Invalid status'),
  body('startDate')
    .optional()
    .isISO8601()
    .withMessage('Invalid start date'),
  body('completionDate')
    .optional()
    .isISO8601()
    .withMessage('Invalid completion date'),
  body('budget')
    .optional()
    .isNumeric()
    .withMessage('Budget must be a number'),
  body('size')
    .optional()
    .isNumeric()
    .withMessage('Size must be a number')
];

// Public routes
router.get('/', projectController.getAllProjects);
router.get('/categories', projectController.getProjectCategories);
router.get('/featured', projectController.getFeaturedProjects);
router.get('/:id', projectController.getProject);

// Protected routes (require authentication)
router.post(
  '/',
  auth.authenticate,
  upload.array('images', 10),
  projectValidation,
  validation.validate,
  projectController.createProject
);

router.put(
  '/:id',
  auth.authenticate,
  upload.array('images', 10),
  projectValidation,
  validation.validate,
  projectController.updateProject
);

router.patch(
  '/:id/status',
  auth.authenticate,
  [
    body('status')
      .isIn(['planning', 'in-progress', 'completed', 'on-hold'])
      .withMessage('Invalid status')
  ],
  validation.validate,
  projectController.updateProjectStatus
);

router.delete(
  '/:id',
  auth.authenticate,
  projectController.deleteProject
);

router.post(
  '/:id/images',
  auth.authenticate,
  upload.array('images', 5),
  projectController.addProjectImages
);

router.delete(
  '/:id/images/:imageId',
  auth.authenticate,
  projectController.deleteProjectImage
);

module.exports = router;