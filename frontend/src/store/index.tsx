import React, { createContext, useContext, useEffect, useReducer, ReactNode } from 'react';
import { 
  User, Vehicle, Driver, Trip, MaintenanceRecord, 
  FuelLog, Expense, ActivityLog, Customer, Invoice
} from '../types';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

interface State {
  currentUser: User | null;
  workspacePreferences: {
    workspaceName: string;
    timezone: string;
    dailyDigest: boolean;
    dispatchAlerts: boolean;
    darkMode: boolean;
  };
  vehicles: Vehicle[];
  drivers: Driver[];
  trips: Trip[];
  maintenanceRecords: MaintenanceRecord[];
  fuelLogs: FuelLog[];
  expenses: Expense[];
  activityLogs: ActivityLog[];
  customers: Customer[];
  invoices: Invoice[];
}

type Action = 
  | { type: 'LOGIN'; payload: User }
  | { type: 'UPDATE_USER'; payload: User }
  | { type: 'UPDATE_WORKSPACE_PREFERENCES'; payload: State['workspacePreferences'] }
  | { type: 'LOGOUT' }
  | { type: 'ADD_VEHICLE'; payload: Vehicle }
  | { type: 'UPDATE_VEHICLE'; payload: Vehicle }
  | { type: 'RETIRE_VEHICLE'; payload: string }
  | { type: 'ADD_DRIVER'; payload: Driver }
  | { type: 'UPDATE_DRIVER'; payload: Driver }
  | { type: 'CREATE_TRIP'; payload: Trip }
  | { type: 'DISPATCH_TRIP'; payload: string }
  | { type: 'COMPLETE_TRIP'; payload: { tripId: string, finalOdometer: number, fuelConsumed: number, date: string, fuelCost: number } }
  | { type: 'CANCEL_TRIP'; payload: string }
  | { type: 'CREATE_MAINTENANCE'; payload: MaintenanceRecord }
  | { type: 'CLOSE_MAINTENANCE'; payload: string }
  | { type: 'ADD_FUEL_LOG'; payload: FuelLog }
  | { type: 'ADD_EXPENSE'; payload: Expense }
  | { type: 'ADD_CUSTOMER'; payload: Customer }
  | { type: 'UPDATE_CUSTOMER'; payload: Customer }
  | { type: 'DELETE_CUSTOMER'; payload: string }
  | { type: 'ADD_INVOICE'; payload: Invoice };

const seedState: State = {
  currentUser: null,
  workspacePreferences: {
    workspaceName: 'TransitOps Workspace',
    timezone: 'Asia/Kolkata',
    dailyDigest: true,
    dispatchAlerts: true,
    darkMode: false,
  },
  vehicles: [
    {
      id: 'v1',
      registrationNumber: 'VAN-05',
      name: 'Ford Transit Cargo',
      type: 'Van',
      maxLoadCapacity: 500,
      odometer: 15000,
      acquisitionCost: 35000,
      status: 'Available',
    },
    {
      id: 'v2',
      registrationNumber: 'TRK-12',
      name: 'Freightliner Cascadia',
      type: 'Truck',
      maxLoadCapacity: 5000,
      odometer: 42000,
      acquisitionCost: 75000,
      status: 'On Trip',
    },
    {
      id: 'v3',
      registrationNumber: 'TRK-04',
      name: 'Volvo VNL 860',
      type: 'Truck',
      maxLoadCapacity: 3000,
      odometer: 28000,
      acquisitionCost: 55000,
      status: 'In Shop',
    },
    {
      id: 'v4',
      registrationNumber: 'VAN-90',
      name: 'Mercedes-Benz Sprinter',
      type: 'Van',
      maxLoadCapacity: 800,
      odometer: 8500,
      acquisitionCost: 42000,
      status: 'Available',
    },
    {
      id: 'v5',
      registrationNumber: 'CAR-19',
      name: 'Toyota Prius Leco',
      type: 'Car',
      maxLoadCapacity: 250,
      odometer: 120000,
      acquisitionCost: 18000,
      status: 'Retired',
    }
  ],
  drivers: [
    {
      id: 'd1',
      name: 'Alex Rivera',
      licenseNumber: 'DL-552912',
      licenseCategory: 'C',
      licenseExpiryDate: '2028-12-31',
      contactNumber: '555-0101',
      safetyScore: 98,
      status: 'Available'
    },
    {
      id: 'd2',
      name: 'Sarah Connor',
      licenseNumber: 'DL-987654',
      licenseCategory: 'C',
      licenseExpiryDate: '2023-01-01', // Expired
      contactNumber: '555-0102',
      safetyScore: 85,
      status: 'Available'
    },
    {
      id: 'd3',
      name: 'Marcus Miller',
      licenseNumber: 'DL-448291',
      licenseCategory: 'C',
      licenseExpiryDate: '2029-06-30',
      contactNumber: '555-0199',
      safetyScore: 92,
      status: 'On Trip'
    },
    {
      id: 'd4',
      name: 'David Kim',
      licenseNumber: 'DL-110294',
      licenseCategory: 'B',
      licenseExpiryDate: '2027-10-15',
      contactNumber: '555-0284',
      safetyScore: 58, // Low score
      status: 'Suspended'
    },
    {
      id: 'd5',
      name: 'Jane Doe',
      licenseNumber: 'DL-882910',
      licenseCategory: 'C',
      licenseExpiryDate: '2028-04-20',
      contactNumber: '555-0391',
      safetyScore: 95,
      status: 'Off Duty'
    }
  ],
  trips: [
    {
      id: 't1',
      source: 'Chicago',
      destination: 'New York',
      vehicleId: 'v2',
      driverId: 'd3',
      cargoWeight: 3500,
      plannedDistance: 800,
      status: 'Dispatched',
      date: new Date().toISOString(),
    },
    {
      id: 't2',
      source: 'Seattle',
      destination: 'Denver',
      vehicleId: 'v1',
      driverId: 'd1',
      cargoWeight: 450,
      plannedDistance: 1300,
      status: 'Completed',
      date: '2026-07-10',
    },
    {
      id: 't3',
      source: 'Los Angeles',
      destination: 'Denver',
      vehicleId: 'v4',
      driverId: 'd5',
      cargoWeight: 600,
      plannedDistance: 1000,
      status: 'Draft',
      date: '2026-07-11',
    }
  ],
  maintenanceRecords: [
    {
      id: 'm1',
      vehicleId: 'v3',
      type: 'Engine Repair',
      description: 'Cylinder misfire warning audit diagnostics check.',
      cost: 850,
      date: '2026-07-10',
      status: 'Active',
    },
    {
      id: 'm2',
      vehicleId: 'v2',
      type: 'Oil Change',
      description: 'Scheduled multi-grade synthetic engine oil swap.',
      cost: 150,
      date: '2026-06-15',
      status: 'Closed',
    },
    {
      id: 'm3',
      vehicleId: 'v1',
      type: 'Tire Replacement',
      description: 'Front dual tires replaced with all-weather tread.',
      cost: 400,
      date: '2026-05-20',
      status: 'Closed',
    }
  ],
  fuelLogs: [
    {
      id: 'fl1',
      vehicleId: 'v1',
      liters: 85,
      cost: 130,
      date: '2026-07-01',
    },
    {
      id: 'fl2',
      vehicleId: 'v2',
      liters: 320,
      cost: 540,
      date: '2026-07-02',
    },
    {
      id: 'fl3',
      vehicleId: 'v3',
      liters: 120,
      cost: 190,
      date: '2026-06-28',
    }
  ],
  expenses: [
    {
      id: 'e1',
      vehicleId: 'v2',
      type: 'Toll',
      amount: 45,
      date: '2026-07-03',
      description: 'Highway Toll Route 80',
    },
    {
      id: 'e2',
      vehicleId: 'v1',
      type: 'Toll',
      amount: 25,
      date: '2026-07-01',
      description: 'Interstate 90 Toll',
    }
  ],
  activityLogs: [
    {
      id: 'act1',
      type: 'Trip',
      message: 'New trip dispatched: Chicago ➔ New York on TRK-12',
      date: new Date().toISOString(),
    },
    {
      id: 'act2',
      type: 'Maintenance',
      message: 'Maintenance scheduled for TRK-04: Engine Repair',
      date: '2026-07-11T14:30:00Z',
    },
    {
      id: 'act3',
      type: 'Trip',
      message: 'Trip completed: Seattle ➔ Denver by driver Alex Rivera',
      date: '2026-07-10T18:45:00Z',
    }
  ],
  customers: [
    { id: 'c1', name: 'Global Logistics Inc.', contactPerson: 'John Smith', email: 'john@global.logistics.com', phone: '555-0909', status: 'Active', totalRevenue: 125000 },
    { id: 'c2', name: 'Apex Shipping', contactPerson: 'Alice Cooper', email: 'alice@apex.com', phone: '555-1234', status: 'Active', totalRevenue: 85000 },
  ],
  invoices: [
    { id: 'INV-1001', customerId: 'c1', tripId: 't1', amount: 4500, issueDate: '2026-07-01', dueDate: '2026-07-15', status: 'Pending' },
    { id: 'INV-1002', customerId: 'c2', tripId: 't2', amount: 3200, issueDate: '2026-06-15', dueDate: '2026-06-30', status: 'Overdue' },
    { id: 'INV-1003', customerId: 'c1', tripId: 't3', amount: 8900, issueDate: '2026-06-01', dueDate: '2026-06-15', status: 'Paid' },
  ],
};

function logActivity(state: State, message: string, type: ActivityLog['type']): ActivityLog[] {
  const newLog: ActivityLog = {
    id: Math.random().toString(36).substr(2, 9),
    date: new Date().toISOString(),
    message,
    type
  };
  return [newLog, ...state.activityLogs].slice(0, 50); // Keep last 50
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'LOGIN':
      return { ...state, currentUser: action.payload };
    case 'UPDATE_USER':
      toast.success('Profile updated');
      return { ...state, currentUser: action.payload };
    case 'UPDATE_WORKSPACE_PREFERENCES':
      toast.success('Workspace preferences saved');
      return { ...state, workspacePreferences: action.payload };
    case 'LOGOUT':
      return { ...state, currentUser: null };
      
    case 'ADD_VEHICLE':
      toast.success('Vehicle added successfully');
      return { ...state, vehicles: [...state.vehicles, action.payload] };
      
    case 'UPDATE_VEHICLE':
      toast.success('Vehicle updated');
      return {
        ...state,
        vehicles: state.vehicles.map(v => v.id === action.payload.id ? action.payload : v)
      };
      
    case 'RETIRE_VEHICLE':
      toast.success('Vehicle retired');
      return {
        ...state,
        vehicles: state.vehicles.map(v => v.id === action.payload ? { ...v, status: 'Retired' } : v)
      };

    case 'ADD_DRIVER':
      toast.success('Driver added successfully');
      return { ...state, drivers: [...state.drivers, action.payload] };
      
    case 'UPDATE_DRIVER':
      toast.success('Driver updated');
      return {
        ...state,
        drivers: state.drivers.map(d => d.id === action.payload.id ? action.payload : d)
      };

    case 'CREATE_TRIP':
      toast.success('Trip created');
      return { 
        ...state, 
        trips: [...state.trips, action.payload],
        activityLogs: logActivity(state, `Trip created to ${action.payload.destination}`, 'Trip')
      };

    case 'DISPATCH_TRIP': {
      const trip = state.trips.find(t => t.id === action.payload);
      if (!trip) return state;
      
      toast.success('Trip dispatched!');
      return {
        ...state,
        trips: state.trips.map(t => t.id === action.payload ? { ...t, status: 'Dispatched', startDate: new Date().toISOString() } : t),
        vehicles: state.vehicles.map(v => v.id === trip.vehicleId ? { ...v, status: 'On Trip' } : v),
        drivers: state.drivers.map(d => d.id === trip.driverId ? { ...d, status: 'On Trip' } : d),
        activityLogs: logActivity(state, `Trip to ${trip.destination} dispatched`, 'Trip')
      };
    }

    case 'COMPLETE_TRIP': {
      const { tripId, finalOdometer, fuelConsumed, date, fuelCost } = action.payload;
      const trip = state.trips.find(t => t.id === tripId);
      if (!trip) return state;

      toast.success('Trip completed');
      
      // Auto-create a fuel log based on the trip's fuel consumption
      const fuelLog: FuelLog | null = fuelConsumed > 0 ? {
        id: Math.random().toString(36).substr(2, 9),
        vehicleId: trip.vehicleId,
        date: date,
        liters: fuelConsumed,
        cost: fuelCost
      } : null;

      return {
        ...state,
        trips: state.trips.map(t => t.id === tripId ? { ...t, status: 'Completed', endDate: date, finalOdometer, fuelConsumed } : t),
        vehicles: state.vehicles.map(v => v.id === trip.vehicleId ? { ...v, status: 'Available', odometer: finalOdometer } : v),
        drivers: state.drivers.map(d => d.id === trip.driverId ? { ...d, status: 'Available' } : d),
        fuelLogs: fuelLog ? [...state.fuelLogs, fuelLog] : state.fuelLogs,
        activityLogs: logActivity(state, `Trip to ${trip.destination} completed`, 'Trip')
      };
    }

    case 'CANCEL_TRIP': {
      const trip = state.trips.find(t => t.id === action.payload);
      if (!trip) return state;

      toast.success('Trip cancelled');
      return {
        ...state,
        trips: state.trips.map(t => t.id === action.payload ? { ...t, status: 'Cancelled' } : t),
        // only free up if it was dispatched
        vehicles: trip.status === 'Dispatched' ? state.vehicles.map(v => v.id === trip.vehicleId ? { ...v, status: 'Available' } : v) : state.vehicles,
        drivers: trip.status === 'Dispatched' ? state.drivers.map(d => d.id === trip.driverId ? { ...d, status: 'Available' } : d) : state.drivers,
        activityLogs: logActivity(state, `Trip to ${trip.destination} cancelled`, 'Trip')
      };
    }

    case 'CREATE_MAINTENANCE': {
      toast.success('Maintenance record created');
      return {
        ...state,
        maintenanceRecords: [...state.maintenanceRecords, action.payload],
        vehicles: action.payload.status === 'Active' 
          ? state.vehicles.map(v => v.id === action.payload.vehicleId ? { ...v, status: 'In Shop' } : v)
          : state.vehicles,
        activityLogs: logActivity(state, `Maintenance opened for vehicle`, 'Maintenance')
      };
    }

    case 'CLOSE_MAINTENANCE': {
      const record = state.maintenanceRecords.find(m => m.id === action.payload);
      if (!record) return state;

      toast.success('Maintenance closed');
      return {
        ...state,
        maintenanceRecords: state.maintenanceRecords.map(m => m.id === action.payload ? { ...m, status: 'Closed' } : m),
        // Restore vehicle to available ONLY if it's not retired
        vehicles: state.vehicles.map(v => {
          if (v.id === record.vehicleId && v.status !== 'Retired') {
            return { ...v, status: 'Available' };
          }
          return v;
        }),
        activityLogs: logActivity(state, `Maintenance closed`, 'Maintenance')
      };
    }

    case 'ADD_FUEL_LOG':
      toast.success('Fuel log added');
      return { ...state, fuelLogs: [...state.fuelLogs, action.payload] };

    case 'ADD_EXPENSE':
      toast.success('Expense added');
      return { ...state, expenses: [...state.expenses, action.payload] };
    case 'ADD_CUSTOMER':
      toast.success('Customer added successfully');
      return { ...state, customers: [...state.customers, action.payload] };
    case 'UPDATE_CUSTOMER':
      toast.success('Client updated');
      return {
        ...state,
        customers: state.customers.map(c => c.id === action.payload.id ? action.payload : c)
      };
    case 'DELETE_CUSTOMER':
      toast.success('Client removed');
      return {
        ...state,
        customers: state.customers.filter(c => c.id !== action.payload)
      };
    case 'ADD_INVOICE':
      toast.success('Invoice generated');
      return { ...state, invoices: [...state.invoices, action.payload] };

    default:
      return state;
  }
}

const StoreContext = createContext<{
  state: State;
  dispatch: React.Dispatch<Action>;
} | undefined>(undefined);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, seedState, () => {
    try {
      const saved = localStorage.getItem('transitops-demo-state-v2');
      return saved ? { ...seedState, ...JSON.parse(saved), workspacePreferences: { ...seedState.workspacePreferences, ...JSON.parse(saved).workspacePreferences } } : seedState;
    } catch { return seedState; }
  });

  useEffect(() => {
    localStorage.setItem('transitops-demo-state-v2', JSON.stringify(state));
  }, [state]);

  return (
    <StoreContext.Provider value={{ state, dispatch }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
}
