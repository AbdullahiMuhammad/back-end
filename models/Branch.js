import {Schema, model} from 'mongoose';

const BranchSchema = new Schema({
  agency: { type: Schema.ObjectId, ref: 'Agency', required: true },
  name: String,
  email: String,   // this is the main branch email
  state: String,
  localGov: String,
  address: String,
  phone: String,
  agents: [
    { name: String, email: String, phone: String } // individual agent emails
  ],
  
}, { timestamps: true });

const Branch = model('Branch', BranchSchema);
export default Branch;
