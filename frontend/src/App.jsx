import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { FleetProvider } from './context/FleetContext';

import LoginPage from './pages/LoginPage';
import DashboardLayout from './components/Layout/DashboardLayout';

import AdminDashboard      from './pages/dashboards/AdminDashboard';
import DispatcherDashboard from './pages/dashboards/DispatcherDashboard';
import DriverDashboard     from './pages/dashboards/DriverDashboard';

import VehicleManagement from './pages/VehicleManagement';
import DriverManagement  from './pages/DriverManagement';
import TripDispatcher    from './pages/TripDispatcher';
import VehicleMaintenance from './pages/VehicleMaintenance';
import FuelExpenses      from './pages/FuelExpenses';
import ReportsAnalytics  from './pages/ReportsAnalytics';
import SettingsRBAC      from './pages/SettingsRBAC';
import PlaceholderPage   from './pages/PlaceholderPage';

// Renders the correct dashboard based on the logged-in user's role
function RoleDashboard() {
  const { user } = useAuth();
  if (user?.role === 'Administrator') return <AdminDashboard />;
  if (user?.role === 'Dispatcher')    return <DispatcherDashboard />;
  if (user?.role === 'Driver')        return <DriverDashboard />;
  return <Navigate to="/login" replace />;
}

// Redirects unauthenticated users to login
function ProtectedRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
}

// Redirects already-logged-in users away from login page
function PublicRoute({ children }) {
  const { user } = useAuth();
  return user ? <Navigate to="/dashboard" replace /> : children;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />

      <Route path="/login" element={
        <PublicRoute><LoginPage /></PublicRoute>
      } />

      <Route path="/" element={
        <ProtectedRoute><DashboardLayout /></ProtectedRoute>
      }>
        <Route path="dashboard"   element={<RoleDashboard />} />
        <Route path="vehicles"    element={<VehicleManagement />} />
        <Route path="drivers"     element={<DriverManagement />} />
        <Route path="trips"       element={<TripDispatcher />} />
        <Route path="maintenance" element={<VehicleMaintenance />} />
        <Route path="fuel"        element={<FuelExpenses />} />
        <Route path="expenses"    element={<PlaceholderPage />} />
        <Route path="reports"     element={<ReportsAnalytics />} />
        <Route path="settings"    element={<SettingsRBAC />} />
      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <FleetProvider>
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </FleetProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
