import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

// Custom hook to use the AuthContext
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  // Initialize isAuthenticated state based on local storage value
  const [isAuthenticated, setIsAuthenticated] = useState(localStorage.getItem('isLoggedIn') === 'true');

  // Function to log in the user
  const login = () => {
    setIsAuthenticated(true);
    localStorage.setItem('isLoggedIn', 'true'); // Store login status in local storage
  };

  // Function to log out the user
  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('isLoggedIn'); // Remove login status from local storage
    localStorage.removeItem('username'); // Optionally remove the username
  };

  // Provide the authentication state and functions to the component tree
  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
