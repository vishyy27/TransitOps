export type Role = 'Fleet Manager' | 'Driver' | 'Safety Officer' | 'Financial Analyst';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  password?: string;
  status?: 'Active' | 'Suspended';
}

export type VehicleStatus = 'Available' | 'On Trip' | 'In Shop' | 'Retired';
export interface Vehicle {
  id: string;
  registrationNumber: string;
  name: string;
  type: string;
  maxLoadCapacity: number;
  odometer: number;
  acquisitionCost: number;
  status: VehicleStatus;
}

export type DriverStatus = 'Available' | 'On Trip' | 'Off Duty' | 'Suspended';
export interface Driver {
  id: string;
  name: string;
  licenseNumber: string;
  licenseCategory: string;
  licenseExpiryDate: string;
  contactNumber: string;
  safetyScore: number;
  status: DriverStatus;
}

export type TripStatus = 'Draft' | 'Dispatched' | 'Completed' | 'Cancelled';
export interface Trip {
  id: string;
  source: string;
  destination: string;
  vehicleId: string;
  driverId: string;
  cargoWeight: number;
  plannedDistance: number;
  status: TripStatus;
  startDate?: string;
  endDate?: string;
  date?: string;
  finalOdometer?: number;
  fuelConsumed?: number;
}

export type MaintenanceStatus = 'Active' | 'Closed';
export interface MaintenanceRecord {
  id: string;
  vehicleId: string;
  type: string;
  description: string;
  cost: number;
  date: string;
  status: MaintenanceStatus;
}

export interface FuelLog {
  id: string;
  vehicleId: string;
  date: string;
  liters: number;
  cost: number;
}

export interface Expense {
  id: string;
  vehicleId: string;
  type: string;
  amount: number;
  date: string;
  description: string;
}

export interface ActivityLog {
  id: string;
  date: string;
  message: string;
  type: 'Trip' | 'Maintenance' | 'System';
}

export type CustomerStatus = 'Active' | 'Inactive' | 'Lead';
export interface Customer {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  status: CustomerStatus;
  totalRevenue: number;
}

export type InvoiceStatus = 'Paid' | 'Pending' | 'Overdue';
export interface Invoice {
  id: string;
  customerId: string;
  tripId: string;
  amount: number;
  issueDate: string;
  dueDate: string;
  status: InvoiceStatus;
}
