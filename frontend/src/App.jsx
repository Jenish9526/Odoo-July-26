import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import LoginPage from './pages/LoginPage';
import DashboardLayout from './components/Layout/DashboardLayout';
import DashboardOverview from './pages/DashboardOverview';
import VehicleManagement from './pages/VehicleManagement';
import DriverManagement from './pages/DriverManagement';
import TripDispatcher from './pages/TripDispatcher';
import VehicleMaintenance from './pages/VehicleMaintenance';
import FuelExpenses from './pages/FuelExpenses';
import ReportsAnalytics from './pages/ReportsAnalytics';
import SettingsRBAC from './pages/SettingsRBAC';
import PlaceholderPage from './pages/PlaceholderPage';

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          {/* Main Public Routes */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<LoginPage />} />
          
          {/* Protected Dashboard Shell Routes */}
          <Route path="/" element={<DashboardLayout />}>
            <Route path="dashboard" element={<DashboardOverview />} />
            <Route path="vehicles" element={<VehicleManagement />} />
            <Route path="drivers" element={<DriverManagement />} />
            <Route path="trips" element={<TripDispatcher />} />
            <Route path="maintenance" element={<VehicleMaintenance />} />
            <Route path="fuel" element={<FuelExpenses />} />
            <Route path="expenses" element={<PlaceholderPage />} />
            <Route path="reports" element={<ReportsAnalytics />} />
            <Route path="settings" element={<SettingsRBAC />} />
          </Route>

          {/* Wildcard Fallback */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
