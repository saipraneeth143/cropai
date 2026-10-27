const express = require('express');
const router = express.Router();
const { authenticateUser } = require('../middleware/auth');
const {
  createFarm,
  getUserFarms,
  getFarmById,
  updateFarm,
  deleteFarm
} = require('../controllers/farmController');

// All routes require authentication
router.use(authenticateUser);

router.post('/', createFarm);
router.get('/', getUserFarms);
router.get('/:id', getFarmById);
router.put('/:id', updateFarm);
router.delete('/:id', deleteFarm);

module.exports = router;
