import mongoose from 'mongoose';
const { Schema, model, Types } = mongoose;

// Branch Schema
const BranchSchema = new Schema({
  name: { type: String, required: true },
  address_line: { type: String, required: true },
  city: { type: String, required: true },
  province: { type: String },
  country: { type: String }
});

// Management Schema
const ManagementSchema = new Schema({
  name: { type: String, required: true },
  position: { type: String, required: true }
});

// Regulatory Compliance Schema
const RegulatoryComplianceSchema = new Schema({
  license_name: { type: String, required: true },
  issue_date: { type: Date },
  expiry_date: { type: Date },
  status: { type: String, enum: ['Valid', 'Expired'], default: 'Valid' }
});

// Products / Services Schema
const ProductServiceSchema = new Schema({
  product_name: { type: String, required: true },
  therapeutic_area: { type: String },
  manufacturing_capacity: { type: Number }
});

// Quality & Safety Schema
const QualitySafetySchema = new Schema({
  quality_assurance: { type: String },
  safety_protocols: [{ type: String }],
  pharmacovigilance: { type: Boolean, default: false }
});

// Financial Overview Schema
const FinancialOverviewSchema = new Schema({
  annual_turnover: { type: Number },
  major_clients: [{ type: String }]
});

// Future Plans Schema
const FuturePlansSchema = new Schema({
  expansion: { type: String },
  new_products: [{ type: String }],
  technology_upgrades: [{ type: String }]
});

// Organization-User Role Schema
const OrganizationUserSchema = new Schema({
  user: { type: Types.ObjectId, ref: 'User', required: true },
  role: { type: String, enum: ['Admin', 'Manager', 'Staff'], default: 'Staff' },
  permissions: [{ type: String }]
});

// Main Organization Schema
const OrganizationSchema = new Schema({
  organization_name: { type: String, required: true },
  type: { type: String },
  date_established: { type: Date },
  registration_number: { type: String, required: true },
  headquarters: {
    address_line: { type: String },
    city: { type: String },
    province: { type: String },
    country: { type: String },
    postal_code: { type: String }
  },
  branches: [BranchSchema],
  contacts: {
    email: { type: String },
    phone: { type: String },
    website: { type: String }
  },
  management: [ManagementSchema],
  mission: { type: String },
  vision: { type: String },
  values: [{ type: String }],
  regulatory_compliance: [RegulatoryComplianceSchema],
  products_services: [ProductServiceSchema],
  quality_safety: QualitySafetySchema,
  financial_overview: FinancialOverviewSchema,
  csr_initiatives: [{ type: String }],
  future_plans: FuturePlansSchema,
  organization_users: [OrganizationUserSchema],
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
}, { timestamps: true }); // optional: automatically manages createdAt/updatedAt

// Auto-update updated_at before save
OrganizationSchema.pre('save', function(next) {
  this.updated_at = Date.now();
  next();
});

const Organization = model('Organization', OrganizationSchema);
export default Organization;
