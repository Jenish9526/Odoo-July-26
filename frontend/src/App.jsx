import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import ProtectedRoute from './components/ProtectedRoute';

// Public
import LoginPage from './pages/LoginPage';

// Standalone Role Dashboards
import DispatcherDashboard from './pages/DispatcherDashboard';
import DriverDashboard from './pages/DriverDashboard';

// Full feature shell (admin / fleet manager)
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
          {/* ── Public ── */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<LoginPage />} />

          {/* ── Standalone Role Dashboards ── */}
          <Route path="/dispatcher-dashboard" element={<DispatcherDashboard />} />
          <Route path="/driver-dashboard" element={<DriverDashboard />} />

          {/* ── Full-feature Dashboard Shell (admin / fleet manager) ── */}
          <Route
            path="/"
            element={
              <ProtectedRoute allowedRoles={['Administrator', 'Fleet Manager', 'Safety Officer', 'Financial Analyst']}>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
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

          {/* ── Wildcard ── */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
