import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import DashboardLayout from './components/Layout/DashboardLayout';
import DashboardOverview from './pages/DashboardOverview';
import VehicleManagement from './pages/VehicleManagement';
import PlaceholderPage from './pages/PlaceholderPage';

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<DashboardLayout />}>
            {/* Redirect root path to dashboard overview */}
            <Route index element={<Navigate to="/dashboard" replace />} />
            
            {/* Core TransitOps Routes */}
            <Route path="dashboard" element={<DashboardOverview />} />
            <Route path="vehicles" element={<VehicleManagement />} />
            <Route path="drivers" element={<PlaceholderPage />} />
            <Route path="trips" element={<PlaceholderPage />} />
            <Route path="maintenance" element={<PlaceholderPage />} />
            <Route path="fuel" element={<PlaceholderPage />} />
            <Route path="expenses" element={<PlaceholderPage />} />
            <Route path="reports" element={<PlaceholderPage />} />
            <Route path="settings" element={<PlaceholderPage />} />
            
            {/* Fallback routing */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
