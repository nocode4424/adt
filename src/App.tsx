import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './components/auth/AuthProvider';
import { Navbar } from './components/layout/Navbar';
import { Dashboard } from './pages/Dashboard';
import { Incidents } from './pages/Incidents';
import { Expenses } from './pages/Expenses';
import { Assets } from './pages/Assets';
import { Profile } from './pages/Profile';
import { PrivateRoute } from './components/auth/PrivateRoute';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-neutral-50">
            <Navbar />
            <main className="container mx-auto px-4 pt-20">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route
                  path="/incidents"
                  element={
                    <PrivateRoute>
                      <Incidents />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/expenses"
                  element={
                    <PrivateRoute>
                      <Expenses />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/assets"
                  element={
                    <PrivateRoute>
                      <Assets />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <PrivateRoute>
                      <Profile />
                    </PrivateRoute>
                  }
                />
              </Routes>
            </main>
            <Toaster position="top-right" />
          </div>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;