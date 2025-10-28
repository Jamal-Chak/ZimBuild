const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const auth = require('../middleware/auth');

// Upload single file
router.post(
  '/single',
  auth.authenticate,
  upload.single('file'),
  (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          status: 'error',
          message: 'No file uploaded'
        });
      }

      res.status(200).json({
        status: 'success',
        message: 'File uploaded successfully',
        data: {
          filename: req.file.filename,
          originalName: req.file.originalname,
          size: req.file.size,
          mimetype: req.file.mimetype,
          url: `/uploads/${req.file.filename}`
        }
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: 'File upload failed',
        error: error.message
      });
    }
  }
);

// Upload multiple files
router.post(
  '/multiple',
  auth.authenticate,
  upload.array('files', 10),
  (req, res) => {
    try {
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({
          status: 'error',
          message: 'No files uploaded'
        });
      }

      const uploadedFiles = req.files.map(file => ({
        filename: file.filename,
        originalName: file.originalname,
        size: file.size,
        mimetype: file.mimetype,
        url: `/uploads/${file.filename}`
      }));

      res.status(200).json({
        status: 'success',
        message: 'Files uploaded successfully',
        data: {
          files: uploadedFiles,
          count: uploadedFiles.length
        }
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: 'Files upload failed',
        error: error.message
      });
    }
  }
);

// Get upload info
router.get('/info/:filename', (req, res) => {
  const fs = require('fs');
  const path = require('path');
  
  const filename = req.params.filename;
  const filePath = path.join(__dirname, '../uploads', filename);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({
      status: 'error',
      message: 'File not found'
    });
  }

  const stats = fs.statSync(filePath);
  
  res.json({
    status: 'success',
    data: {
      filename,
      size: stats.size,
      created: stats.birthtime,
      modified: stats.mtime
    }
  });
});

// Delete uploaded file
router.delete(
  '/:filename',
  auth.authenticate,
  (req, res) => {
    const fs = require('fs');
    const path = require('path');
    
    const filename = req.params.filename;
    const filePath = path.join(__dirname, '../uploads', filename);

    try {
      if (!fs.existsSync(filePath)) {
        return res.status(404).json({
          status: 'error',
          message: 'File not found'
        });
      }

      fs.unlinkSync(filePath);
      
      res.json({
        status: 'success',
        message: 'File deleted successfully'
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: 'File deletion failed',
        error: error.message
      });
    }
  }
);

module.exports = router;