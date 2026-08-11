const express = require('express');
const router = express.Router();
const candidateController = require('../controllers/candidateController');
const { protect, authorize } = require('../middleware/auth');
const logActivity = require('../middleware/audit');

router.route('/')
  .post(protect, authorize('admin', 'officer'), logActivity('add_candidate'), candidateController.addCandidate);

router.route('/:id')
  .get(candidateController.getCandidateById)
  .put(protect, authorize('admin', 'officer'), logActivity('update_candidate'), candidateController.updateCandidate)
  .delete(protect, authorize('admin', 'officer'), logActivity('remove_candidate'), candidateController.removeCandidate);

module.exports = router;
