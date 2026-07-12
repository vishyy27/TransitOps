/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { StoreProvider } from './store';
import { Toaster } from 'react-hot-toast';
import { Layout } from './lib/Layout';
import { Login } from './pages/Login';
import { Landing } from './pages/Landing';
import { Dashboard } from './pages/Dashboard';
import { Vehicles } from './pages/Vehicles';
import { Drivers } from './pages/Drivers';
import { Trips } from './pages/Trips';
import { Maintenance } from './pages/Maintenance';
import { Fuel } from './pages/Fuel';
import { Reports } from './pages/Reports';
import { Customers } from './pages/Customers';
import { Invoices } from './pages/Invoices';
import { ProfileSettings, WorkspacePreferences } from './pages/Settings';

export default function App() {
  return (
    <StoreProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route element={<Layout />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="vehicles" element={<Vehicles />} />
            <Route path="drivers" element={<Drivers />} />
            <Route path="trips" element={<Trips />} />
            <Route path="maintenance" element={<Maintenance />} />
            <Route path="fuel" element={<Fuel />} />
            <Route path="reports" element={<Reports />} />
          <Route path="customers" element={<Customers />} />
          <Route path="invoices" element={<Invoices />} />
          <Route path="profile-settings" element={<ProfileSettings />} />
          <Route path="workspace-preferences" element={<WorkspacePreferences />} />
          </Route>
        </Routes>
      </BrowserRouter>
      <Toaster position="top-right" toastOptions={{
        className: 'font-sans text-slate-900',
        style: {
          border: '1px solid #FBE9D0',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        }
      }} />
    </StoreProvider>
  );
}

