const express = require('express');
const router = express.Router();
const { authenticateUser } = require('../middleware/auth');
const {
  generateAdvisory,
  getAdvisoriesByFarm,
  getAdvisoryById
} = require('../controllers/advisoryController');

// All routes require authentication
router.use(authenticateUser);

router.post('/generate', generateAdvisory);
router.get('/farm/:farmId', getAdvisoriesByFarm);
router.get('/:id', getAdvisoryById);

module.exports = router;
