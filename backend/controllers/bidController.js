
const mongoose = require('mongoose');
const Bid = require('../models/Bid');
const Gig = require('../models/Gig');
const Notification = require('../models/Notification'); 


const placeBid = async (req, res) => {
  try {
    const { gigId, price, message } = req.body;

   
    const gig = await Gig.findById(gigId);
    if (!gig) {
      return res.status(404).json({ message: 'Gig not found' });
    }
    if (gig.status !== 'open') {
      return res.status(400).json({ message: 'This gig is no longer accepting bids' });
    }

    
    if (gig.ownerId.toString() === req.user.id) {
      return res.status(400).json({ message: 'You cannot bid on your own gig' });
    }

    
    const existingBid = await Bid.findOne({ gigId, freelancerId: req.user.id });
    if (existingBid) {
      return res.status(400).json({ message: 'You have already placed a bid on this gig' });
    }

  
    const bid = await Bid.create({
      gigId,
      freelancerId: req.user.id,
      price,
      message,
      status: 'pending'
    });

    
    await Notification.create({
      recipientId: gig.ownerId, 
      senderId: req.user.id,   
      type: 'new_bid',
      message: `New bid of $${price} received for "${gig.title}"`,
      gigId: gig._id
    });

    
    const io = req.app.get('io');
    if (io) {
        io.to(gig.ownerId.toString()).emit('notification', {
           message: 'You have a new notification' 
        });
    }
    

    res.status(201).json(bid);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'You have already placed a bid on this gig' });
    }
    res.status(500).json({ message: error.message });
  }
};


const getBidsForGig = async (req, res) => {
  try {
    const { gigId } = req.params;

    const gig = await Gig.findById(gigId);
    if (!gig) {
      return res.status(404).json({ message: 'Gig not found' });
    }

    if (gig.ownerId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to view bids for this gig' });
    }

    const bids = await Bid.find({ gigId })
      .populate('freelancerId', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json(bids);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const hireFreelancer = async (req, res) => {
  const { bidId } = req.params;
  
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const bid = await Bid.findById(bidId).session(session);
    if (!bid) {
        await session.abortTransaction();
        return res.status(404).json({ message: 'Bid not found' });
    }

    const gig = await Gig.findById(bid.gigId).session(session);
    if (gig.ownerId.toString() !== req.user.id) {
        await session.abortTransaction();
        return res.status(401).json({ message: 'Not authorized' });
    }

    if (gig.status === 'assigned') {
        await session.abortTransaction();
        return res.status(400).json({ message: 'Gig already assigned' });
    }

    
    bid.status = 'hired';
    await bid.save({ session });

    gig.status = 'assigned';
    await gig.save({ session });

    await Bid.updateMany(
      { gigId: gig._id, _id: { $ne: bidId } },
      { status: 'rejected' },
      { session }
    );
    

    await session.commitTransaction();
    session.endSession();

    
    await Notification.create({
      recipientId: bid.freelancerId, 
      senderId: req.user.id,         
      type: 'hired',
      message: `🎉 You have been hired for "${gig.title}"!`,
      gigId: gig._id
    });

  
    const io = req.app.get('io');
    if (io) {
        io.to(bid.freelancerId.toString()).emit('notification', {
           message: 'You have been hired!' 
        });
    }
    

    res.status(200).json({ success: true, message: 'Freelancer hired!' });

  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ message: 'Transaction failed' });
  }
};


const checkBidStatus = async (req, res) => {
  try {
    const { gigId } = req.params;
    const bid = await Bid.findOne({ gigId, freelancerId: req.user.id });
    res.status(200).json({ hasApplied: !!bid }); 
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { placeBid, getBidsForGig, hireFreelancer, checkBidStatus };