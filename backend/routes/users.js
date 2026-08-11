const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { protect, authorize } = require('../middleware/auth');
const logActivity = require('../middleware/audit');

router.route('/profile')
  .get(protect, userController.getProfile)
  .put(protect, logActivity('update_profile'), userController.updateProfile);

router.route('/')
  .get(protect, authorize('admin', 'officer'), userController.getAllUsers);

router.route('/:id/role')
  .put(protect, authorize('admin'), logActivity('update_user_role'), userController.updateUserRole);

router.route('/:id')
  .delete(protect, authorize('admin'), logActivity('delete_user'), userController.deleteUser);

module.exports = router;
