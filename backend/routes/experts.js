const express = require('express');
const router = express.Router();
const { getExperts, getExpertById } = require('../controllers/experts');

router.get('/', getExperts);
router.get('/:id', getExpertById);

module.exports = router;