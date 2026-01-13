const express = require('express');
const router = express.Router();

const { placeBid, getBidsForGig, hireFreelancer, checkBidStatus } = require('../controllers/bidController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, placeBid);
router.get('/:gigId', protect, getBidsForGig);
router.patch('/:bidId/hire', protect, hireFreelancer);


router.get('/check/:gigId', protect, checkBidStatus);

module.exports = router;