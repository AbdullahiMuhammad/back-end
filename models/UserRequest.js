import mongoose from "mongoose";

const userRequestSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  password: { type: String, required: true },
  address: { type: String },
  state: { type: String },
  zone: { type: String },
  localGovernment: { type: String },

  requestedRoles: { type: [String], enum: ["admin", "zonal-coordinator", "state-coordinator", "inspector"], default: ["inspector"] },
  status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" }
}, { timestamps: true });

const UserRequest=  mongoose.model("UserRequest", userRequestSchema);
export default UserRequest;
