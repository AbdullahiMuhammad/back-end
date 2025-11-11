import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  // Personal Info
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  address: { type: String },

  // Location Info
  state: { type: String },
  zone: { type: String },
  localGovernment: { type: String },

  // Roles & Levels
  roles: [{ type: mongoose.Schema.Types.ObjectId, ref: "Role" }],
  level: { type: Number, default: 1 }, // hierarchy or permissions
  status: { type: String, enum: ["active", "inactive", "suspended"], default: "active" },

  // Reputation
  reputation: { type: Number, default: 0 },
   
  //profile pic
  profilFic: {type: mongoose.Schema.Types.ObjectId, ref: ""},

  // Comments / feedback on user
  comments: [
    {
      commentedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      comment: { type: String },
      createdAt: { type: Date, default: Date.now }
    }
  ],
   password: { type: String, required: true },
},  { timestamps: true });

userSchema.pre("save", async function(next) {
  // Check if the password field is modified (i.e., it's a new user or password change)
  if (!this.isModified("password")) return next();
  

  next();  // Continue to save
});


// Compare password method
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};
userSchema.virtual("fullName").get(function () {
  return `${this.firstName} ${this.lastName}`;
});

// Middleware to update reputation automatically when a task is completed
userSchema.methods.updateReputation = function() {
  const totalPoints = this.tasks.reduce((acc, task) => {
    return acc + (task.status === "completed" ? task.points : 0);
  }, 0);
  this.reputation = totalPoints;
  return this.reputation;
};

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});
export default mongoose.model("User", userSchema);
