const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    // Generate unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname);
    const filename = file.fieldname + '-' + uniqueSuffix + extension;
    cb(null, filename);
  }
});

// File filter configuration
const fileFilter = (req, file, cb) => {
  const allowedMimes = {
    image: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'],
    document: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
    all: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
  };

  // Determine which file types are allowed based on route or field name
  let allowedTypes = allowedMimes.all;
  
  if (file.fieldname === 'resume' || file.fieldname === 'cv') {
    allowedTypes = allowedMimes.document;
  } else if (file.fieldname.includes('image') || file.fieldname === 'avatar') {
    allowedTypes = allowedMimes.image;
  }

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Invalid file type. Allowed types: ${allowedTypes.join(', ')}`), false);
  }
};

// Configure multer instance
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
    files: 10 // Maximum 10 files
  }
});

// Custom error handler for multer
const handleUploadErrors = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        status: 'error',
        message: 'File too large. Maximum size is 10MB.'
      });
    }
    
    if (err.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        status: 'error',
        message: 'Too many files. Maximum is 10 files.'
      });
    }
    
    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({
        status: 'error',
        message: 'Unexpected field name for file upload.'
      });
    }
  }
  
  if (err.message && err.message.startsWith('Invalid file type')) {
    return res.status(400).json({
      status: 'error',
      message: err.message
    });
  }

  next(err);
};

// Utility function to delete uploaded files
const deleteUploadedFile = (filename) => {
  const filePath = path.join(uploadsDir, filename);
  
  return new Promise((resolve, reject) => {
    fs.unlink(filePath, (err) => {
      if (err && err.code !== 'ENOENT') {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};

// Utility function to clean up temporary files on error
const cleanupUploadedFiles = (req) => {
  if (req.file) {
    deleteUploadedFile(req.file.filename).catch(console.error);
  }
  
  if (req.files) {
    req.files.forEach(file => {
      deleteUploadedFile(file.filename).catch(console.error);
    });
  }
};

// Middleware to validate image dimensions (optional)
const validateImageDimensions = (minWidth, minHeight) => {
  return (req, res, next) => {
    if (!req.file) {
      return next();
    }

    // This would typically use a library like sharp or jimp
    // For now, we'll just pass through
    // In a real implementation, you'd check the image dimensions here
    next();
  };
};

module.exports = {
  upload,
  handleUploadErrors,
  deleteUploadedFile,
  cleanupUploadedFiles,
  validateImageDimensions
};