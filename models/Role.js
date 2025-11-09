import { Schema, model, Types } from 'mongoose';

const roleSchema = new Schema({
  role: { type: String, required: true },           // e.g., Admin, Manager, Staff
  userId: { 
    type: Types.ObjectId, 
    ref: 'User', 
    required: true,
    validate: {
      validator: Types.ObjectId.isValid,
      message: 'Invalid userId'
    }
  },
  context: {                                        // optional contexts
    agencyId: { type: Types.ObjectId, ref: 'Agency', required: false },
    incidentId: { type: Types.ObjectId, ref: 'Incident', required: false },
    other: { type: Schema.Types.Mixed }            // free-form field for future contexts
  },
  permissions: [{                                  // list of permissions for this role
    type: String,
    enum: ['read', 'write', 'update', 'delete', 'manage_users'], // example
    required: true
  }],
  startDate: { type: Date, required: true },
  endDate: { type: Date, default: null }
}, { timestamps: true });

const Role = model('Role', roleSchema);

export default Role;
