import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Login from './components/Auth/Login';
import Discovery from './components/Learning/Discovery';
import LandingPage from './components/Landing/LandingPage';
import ProtectedRoute from './components/Auth/ProtectedRoute';

const App = () => {
  return (
    <AuthProvider> {/* Wrapping the application with AuthProvider to provide authentication context */}
      <Router> {/* Setting up the router for navigation */}
        <Routes> {/* Defining the application routes */}
          <Route path="/" element={<Login />} />
          <Route element={<ProtectedRoute />}> {/* Protected routes require authentication */}
            <Route path="/landing" element={<LandingPage />} />
            <Route path="/discovery" element={<Discovery />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
