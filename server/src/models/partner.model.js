import mongoose from 'mongoose';

const partnerContactSchema = new mongoose.Schema({
  phone: { type: String, required: true },
  email: { type: String, required: true },
  nodalOfficerName: { type: String },
  officeHours: { type: String, default: 'Mon-Fri 10:00 AM - 5:00 PM' }
}, { _id: false });

const pointSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['Point'],
    default: 'Point'
  },
  coordinates: {
    type: [Number], // [longitude, latitude]
    required: true
  }
}, { _id: false });

const partnerSchema = new mongoose.Schema({
  _id: { type: String, required: true }, // e.g. 'PARTNER-KOL-SCA-01'
  name: { type: String, required: true },
  shortCode: { type: String, required: true },
  type: { 
    type: String, 
    enum: ['SCA', 'PSB', 'RRB', 'NBFC-MFI', 'Cooperative Bank', 'SFB', 'Other'],
    required: true 
  },
  authorizedSchemes: [{ type: String, required: true }],
  address: { type: String, required: true },
  city: { type: String, required: true },
  district: { type: String, required: true },
  state: { type: String, required: true },
  pincode: { type: String, required: true },
  location: { type: pointSchema, required: true },
  contact: { type: partnerContactSchema, required: true },
  status: { 
    type: String, 
    enum: ['active', 'temporarily_inactive'],
    default: 'active' 
  },
  verificationStatus: { 
    type: String, 
    default: 'verified_partner_branch' 
  },
  isDemoData: { type: Boolean, default: true },
  notes: { type: String }
}, {
  timestamps: true,
  _id: false
});

export const Partner = mongoose.model('Partner', partnerSchema);
export default Partner;
