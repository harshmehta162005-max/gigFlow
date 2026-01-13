
const Notification = require('../models/Notification');


const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ recipientId: req.user.id })
      .sort({ createdAt: -1 }); 
    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const markRead = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if(notification.recipientId.toString() !== req.user.id) {
        return res.status(401).json({ message: 'Not authorized' });
    }
    notification.read = true;
    await notification.save();
    res.status(200).json(notification);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getNotifications, markRead };