const express = require('express');
const router = express.Router();

const {
  getAgentGSC,
  updateAgentGSC,
  getTransitaire,
  updateTransitaire
} = require('../controllers/userController');

router.get('/agent', getAgentGSC);
router.put('/agent', updateAgentGSC);

router.get('/transitaire', getTransitaire);
router.put('/transitaire', updateTransitaire);

module.exports = router;
