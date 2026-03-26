/**
 * Validates request body for creating a user.
 */
function validateCreateUser(req, res, next) {
  const { name, email, role } = req.body;
  const errors = [];

  if (!name || typeof name !== 'string' || name.trim().length < 2) {
    errors.push('name is required and must be at least 2 characters');
  }

  if (!email || typeof email !== 'string') {
    errors.push('email is required');
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    errors.push('email must be a valid email address');
  }

  const allowedRoles = ['user', 'admin', 'moderator'];
  if (role && !allowedRoles.includes(role)) {
    errors.push(`role must be one of: ${allowedRoles.join(', ')}`);
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors,
    });
  }

  next();
}

/**
 * Validates request body for updating a user.
 */
function validateUpdateUser(req, res, next) {
  const { name, email, role } = req.body;
  const errors = [];

  if (name !== undefined && (typeof name !== 'string' || name.trim().length < 2)) {
    errors.push('name must be at least 2 characters');
  }

  if (email !== undefined) {
    if (typeof email !== 'string') {
      errors.push('email must be a string');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errors.push('email must be a valid email address');
    }
  }

  const allowedRoles = ['user', 'admin', 'moderator'];
  if (role !== undefined && !allowedRoles.includes(role)) {
    errors.push(`role must be one of: ${allowedRoles.join(', ')}`);
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors,
    });
  }

  next();
}

module.exports = { validateCreateUser, validateUpdateUser };
