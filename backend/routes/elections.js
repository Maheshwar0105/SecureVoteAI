const express = require('express');
const router = express.Router();
const electionController = require('../controllers/electionController');
const { protect, authorize } = require('../middleware/auth');
const logActivity = require('../middleware/audit');

router.route('/')
  .post(protect, authorize('admin', 'officer'), logActivity('create_election'), electionController.createElection)
  .get(electionController.getAllElections);

router.route('/:id')
  .get(electionController.getElectionById)
  .put(protect, authorize('admin', 'officer'), logActivity('update_election'), electionController.updateElection)
  .delete(protect, authorize('admin', 'officer'), logActivity('delete_election'), electionController.deleteElection);

module.exports = router;
