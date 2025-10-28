const { validationResult } = require('express-validator');

// Custom validation middleware
const validate = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(error => ({
      field: error.param,
      message: error.msg,
      value: error.value
    }));

    return res.status(400).json({
      status: 'error',
      message: 'Validation failed',
      errors: errorMessages
    });
  }

  next();
};

// Sanitization middleware
const sanitize = (req, res, next) => {
  // Trim string fields
  if (req.body) {
    Object.keys(req.body).forEach(key => {
      if (typeof req.body[key] === 'string') {
        req.body[key] = req.body[key].trim();
      }
    });
  }

  // Convert empty strings to null
  if (req.body) {
    Object.keys(req.body).forEach(key => {
      if (req.body[key] === '') {
        req.body[key] = null;
      }
    });
  }

  next();
};

// Validate MongoDB ObjectId
const validateObjectId = (req, res, next) => {
  const { id } = req.params;
  
  if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(400).json({
      status: 'error',
      message: 'Invalid ID format'
    });
  }

  next();
};

// Validate file upload
const validateFileUpload = (req, res, next) => {
  if (!req.file && !req.files) {
    return res.status(400).json({
      status: 'error',
      message: 'No file uploaded'
    });
  }

  next();
};

// Validate pagination parameters
const validatePagination = (req, res, next) => {
  const { page = 1, limit = 10 } = req.query;
  
  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  
  if (isNaN(pageNum) || pageNum < 1) {
    return res.status(400).json({
      status: 'error',
      message: 'Page must be a positive integer'
    });
  }
  
  if (isNaN(limitNum) || limitNum < 1 || limitNum > 100) {
    return res.status(400).json({
      status: 'error',
      message: 'Limit must be between 1 and 100'
    });
  }

  // Set validated values
  req.query.page = pageNum;
  req.query.limit = limitNum;
  
  next();
};

// Validate sort parameters
const validateSort = (allowedFields, defaultSort = '-createdAt') => {
  return (req, res, next) => {
    const { sort } = req.query;
    
    if (!sort) {
      req.query.sort = defaultSort;
      return next();
    }

    // Validate sort field
    const sortField = sort.startsWith('-') ? sort.substring(1) : sort;
    
    if (!allowedFields.includes(sortField)) {
      return res.status(400).json({
        status: 'error',
        message: `Invalid sort field. Allowed fields: ${allowedFields.join(', ')}`
      });
    }

    next();
  };
};

// Validate filter parameters
const validateFilter = (allowedFilters) => {
  return (req, res, next) => {
    const filters = { ...req.query };
    
    // Remove pagination and sort parameters
    delete filters.page;
    delete filters.limit;
    delete filters.sort;
    
    // Check for invalid filters
    const invalidFilters = Object.keys(filters).filter(
      key => !allowedFilters.includes(key)
    );
    
    if (invalidFilters.length > 0) {
      return res.status(400).json({
        status: 'error',
        message: `Invalid filter parameters: ${invalidFilters.join(', ')}. Allowed filters: ${allowedFilters.join(', ')}`
      });
    }

    next();
  };
};

// Validate email format
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validate South African phone number
const validateSAPhone = (phone) => {
  const phoneRegex = /^(\+27|27|0)[1-8][0-9]{8}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

// Validate URL format
const validateURL = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// Validate date range
const validateDateRange = (startDate, endDate) => {
  if (!startDate || !endDate) return true;
  
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  return start <= end;
};

module.exports = {
  validate,
  sanitize,
  validateObjectId,
  validateFileUpload,
  validatePagination,
  validateSort,
  validateFilter,
  validateEmail,
  validateSAPhone,
  validateURL,
  validateDateRange
};