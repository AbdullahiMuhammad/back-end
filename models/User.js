import mongoose, { Types } from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  firstName: { type: String },
  lastName: { type: String },
  state: { type: String },
  zone: { type: String },
  lga: { type: String },
  email: { type: String, required: true, unique: true },
  level: {
    type: String,
    enum: ["central", "zonal", "state", "agent"],
    default: "agent",
  },
  
  phone: { type: String },
  password: { type: String, required: true },
  organization: { type: Types.ObjectId, ref: 'Organization', required: false },
  branch: { type: Types.ObjectId, ref: 'Organization.branches' }, // optional
  roles: [{ type: Types.ObjectId, ref: "Role" }],
  status: { type: String, enum: ['active', 'inactive', 'suspended'], default: 'active' },
}, { timestamps: true });

// Password hash before saving
userSchema.pre("save", async function(next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function(password) {
  return bcrypt.compare(password, this.password);
};

// Virtual field (not saved to DB)
userSchema.virtual("fullName").get(function () {
  return `${this.firstName} ${this.lastName}`.trim();
});

const User = mongoose.model('User', userSchema);
export default User;
