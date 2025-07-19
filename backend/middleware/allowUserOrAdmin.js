module.exports = function allowUserOrAdmin(req, res, next) {
  if (
    req.user ||
    (req.session && req.session.admin) ||
    (req.user && req.user.role === 'admin')
  ) {
    return next();
  }
  return res.status(401).json({ message: 'Unauthorized' });
}; 