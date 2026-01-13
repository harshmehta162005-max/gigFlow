
const Gig = require('../models/Gig');


const getAllGigs = async (req, res) => {
  try {
    const { search } = req.query;
    
    
    let query = { status: 'open' }; 

    if (search) {
      query.title = { $regex: search, $options: 'i' }; 
    }

    const gigs = await Gig.find(query)
      .populate('ownerId', 'name email') 
      .sort({ createdAt: -1 }); 

    res.status(200).json(gigs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const createGig = async (req, res) => {
  try {
    const { title, description, budget } = req.body;

    if (!title || !description || !budget) {
      return res.status(400).json({ message: 'Please add all fields' });
    }

    const gig = await Gig.create({
      title,
      description,
      budget,
      ownerId: req.user.id, 
      status: 'open'
    });

    res.status(201).json(gig);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const getGigById = async (req, res) => {
  try {
    const gig = await Gig.findById(req.params.id).populate('ownerId', 'name email');
    
    if(!gig) {
      return res.status(404).json({ message: 'Gig not found' });
    }

    res.status(200).json(gig);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports = { getAllGigs, createGig, getGigById };