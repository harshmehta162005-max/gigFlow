
const express = require('express');
const router = express.Router();
const { getAllGigs, createGig, getGigById } = require('../controllers/gigController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .get(getAllGigs)           
  .post(protect, createGig); 

router.route('/:id')
  .get(getGigById);          

module.exports = router;