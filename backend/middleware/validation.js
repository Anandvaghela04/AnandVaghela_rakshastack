const { body, validationResult } = require('express-validator');

// Validation rules for user registration
const validateRegistration = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please enter a valid email address'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  body('phone')
    .optional()
    .matches(/^[0-9]{10}$/)
    .withMessage('Please enter a valid 10-digit phone number')
];

// Validation rules for user login
const validateLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please enter a valid email address'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

// Validation rules for PG listing creation
const validatePGListing = [
  body('name')
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('PG name must be between 3 and 100 characters'),
  body('description')
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Description must be between 10 and 1000 characters'),
  body('location.address')
    .trim()
    .notEmpty()
    .withMessage('Address is required'),
  body('location.city')
    .trim()
    .notEmpty()
    .withMessage('City is required'),
  body('location.state')
    .trim()
    .notEmpty()
    .withMessage('State is required'),
  body('location.pincode')
    .matches(/^[0-9]{6}$/)
    .withMessage('Please enter a valid 6-digit pincode'),
  body('price.monthly')
    .isInt({ min: 1000, max: 50000 })
    .withMessage('Monthly price must be between 1000 and 50000'),
  body('price.deposit')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Deposit must be a positive number'),
  body('gender')
    .isIn(['boys', 'girls', 'unisex'])
    .withMessage('Gender must be boys, girls, or unisex'),
  body('amenities')
    .optional()
    .isArray()
    .withMessage('Amenities must be an array'),
  body('contactInfo.phone')
    .matches(/^[0-9]{10}$/)
    .withMessage('Please enter a valid 10-digit phone number'),
  body('contactInfo.email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please enter a valid email address')
];

// Validation rules for PG listing update
const validatePGUpdate = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('PG name must be between 3 and 100 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Description must be between 10 and 1000 characters'),
  body('price.monthly')
    .optional()
    .isInt({ min: 1000, max: 50000 })
    .withMessage('Monthly price must be between 1000 and 50000'),
  body('gender')
    .optional()
    .isIn(['boys', 'girls', 'unisex'])
    .withMessage('Gender must be boys, girls, or unisex')
];

// Validation rules for user profile update
const validateProfileUpdate = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  body('phone')
    .optional()
    .matches(/^[0-9]{10}$/)
    .withMessage('Please enter a valid 10-digit phone number')
];

// Middleware to check for validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map(error => ({
        field: error.path,
        message: error.msg
      }))
    });
  }
  next();
};

module.exports = {
  validateRegistration,
  validateLogin,
  validatePGListing,
  validatePGUpdate,
  validateProfileUpdate,
  handleValidationErrors
}; 