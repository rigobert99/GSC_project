const express = require('express');
const router = express.Router();
const { loginUser } = require('../controllers/authController'); // ✅ le chemin doit être correct

router.post('/login', loginUser); // ✅ loginUser doit être bien importé

module.exports = router;
