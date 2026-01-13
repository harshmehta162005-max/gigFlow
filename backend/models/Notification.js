
const mongoose = require('mongoose');

const notificationSchema = mongoose.Schema({
  recipientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, 
  type: { type: String, enum: ['new_bid', 'hired'], required: true },
  message: { type: String, required: true },
  gigId: { type: mongoose.Schema.Types.ObjectId, ref: 'Gig' },
  read: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Notification', notificationSchema);