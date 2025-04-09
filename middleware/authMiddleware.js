const jwtUtil = require('../utilities/jwt-util');

const authMiddleware = {
  // Middleware to check if user is authenticated
  isAuthenticated: (req, res, next) => {
    const token = req.cookies.jwt;
    
    if (!token) {
      req.flash('notice', 'Please log in to access this page.');
      return res.redirect('/account/login');
    }

    try {
      const decoded = jwtUtil.verifyToken(token);
      req.user = decoded;
      next();
    } catch (error) {
      req.flash('notice', 'Your session has expired. Please log in again.');
      res.clearCookie('jwt');
      return res.redirect('/account/login');
    }
  },

  // Middleware to check if user is an employee
  isEmployee: (req, res, next) => {
    if (req.user && req.user.account_type === 'Employee') {
      next();
    } else {
      req.flash('notice', 'You do not have permission to access this page.');
      return res.redirect('/account/login');
    }
  },

  // Middleware to check if user is an admin
  isAdmin: (req, res, next) => {
    if (req.user && req.user.account_type === 'Admin') {
      next();
    } else {
      req.flash('notice', 'You do not have permission to access this page.');
      return res.redirect('/account/login');
    }
  }
};

module.exports = authMiddleware; 