import mongoose, { Schema, model, models } from 'mongoose';

const EmployeeSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  department: { type: String, required: true },
  salary: { type: Number, required: true },
  status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
}, { timestamps: true });

export const Employee = models.Employee || model('Employee', EmployeeSchema);